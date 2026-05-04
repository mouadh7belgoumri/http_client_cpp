#include <iostream>
#include "../include/httplib.h"
#include <webview/webview.h>
#include "../lib/index_html.h"
#include <nlohmann/json.hpp>
#include <thread>
#include <SQLiteCpp/SQLiteCpp.h>
#include <memory>
#include <ada.h>
#include <mutex>
#include <format>
using json = nlohmann::json;
std::mutex db_mutex;
std::mutex window_mutex;
int main(int, char **)
{
    auto w = std::make_shared<webview::webview>(false, nullptr);
    w->set_title("http_client_cpp");
    w->set_size(1200, 900, WEBVIEW_HINT_NONE);
    w->set_html(html);
    w->bind("getRequests", [w](const std::string &id, const std::string &req, void *)
            { std::thread([w, id, req]()
                          {
                             try
                             {
                                 
                                 std::lock_guard<std::mutex> db_lock(db_mutex);
                                 SQLite::Database db{"requests.db", SQLite::OPEN_READONLY};
                                 json j = json::array();
                                 SQLite::Statement query{db, "SELECT id, method, path, headers, body, stored FROM requests"};
                                 int i = 0;
                                 while (query.executeStep())
                                 {
                                     json req_json;
                                     req_json["id"] = query.getColumn(0).getString();
                                     req_json["method"] = query.getColumn(1).getString();
                                     req_json["path"] = query.getColumn(2).getString();
                                     req_json["headers"] = json::parse(query.getColumn(3).getString());
                                     req_json["body"] = json::parse(query.getColumn(4).getString());
                                     req_json["stored"] = json::parse(query.getColumn(5).getString());
                                     j.push_back(req_json);
                                     i++;
                                 }                                 
                                 std::lock_guard w_lck(window_mutex);
                                 w->dispatch([id, j, w]()
                                 {
                                     w->resolve(id, 0, j.dump());
                                 });
                             }
                             catch (const std::exception& e)
                             {
                                std::cerr << e.what() << '\n';
                                std::cout << "Error retrieving requests from database." << std::endl;
                                std::lock_guard w_lck(window_mutex);
                                w->dispatch([id, e, w]()
                                 {
                                     w->resolve(id, 1, std::string(e.what()));
                                 });
                             } })
                  .detach(); }, nullptr);
    w->bind("sendReq", [w](const std::string &id, const std::string &req, void *)
            {
                try
                {
                    std::thread([w, id, req](){
                        json req_json = json::parse(req);
                        auto path = req_json[0]["path"].dump().replace(0,1, "");
                        path = path.replace(path.length()-1, 1, "");
                        auto url = ada::parse<ada::url_aggregator>(path);
                        if (!url){
                            throw "url format error";
                        }
                        auto origin = url -> get_origin(); 
                        httplib::Client cli(origin);
                        auto route = std::string(url -> get_pathname());
                        std::cout << route << std::endl;
                        //TODO add logic to send request according the method value
                        httplib::Result res;
                        if (req_json[0]["method"] == "GET") 
                        {
                            res = cli.Get(route);
                        }else if (req_json[0]["method"] == "POST")
                        {
                            res = cli.Post(route, req_json[0]["body"].dump(), "appilcation/json");
                        }
                        else if (req_json[0]["method"] == "DELETE")
                        {
                            res = cli.Delete(route, req_json[0]["id"].dump(), "appilcation/json");
                        }
                        else if (req_json[0]["method"] == "PUT")
                        {
                            res = cli.Put(route, req_json[0]["body"].dump(), "appilcation/json");
                        }
                        
                        
                        
                        
                        json res_json;
                        if (res) {
                            res_json["status"] = res->status;
                            res_json["headers"] = res->headers;
                            res_json["body"] = res->body;
                        } else {
                            res_json["error"] = "Request failed";
                        }
                        std::lock_guard w_lck(window_mutex);
                        w->dispatch([id, res_json, w]()
                        {
                            w->resolve(id, 0, res_json.dump());
                        });
                    }).detach();
                }
                catch (const std::exception &e)
                {
                    std::cerr << e.what() << '\n';
                } }, nullptr);
    w->bind("createRequest", [w](const std::string &id, const std::string &req, void *)
            {
                try
                {
                    std::thread([w, id, req]()
                                {
                                    json j = json::parse(req);
                                    std::cout << j.dump(4) << std::endl;
                                    
                                    {
                                        std::lock_guard<std::mutex> db_lock(db_mutex);
                                        std::cout << "point reached!" << std::endl;
                                        SQLite::Database db("requests.db", SQLite::OPEN_READWRITE);
                                        std::cout << "database file opened" << std::endl;
                                        SQLite::Statement query(db, "insert into requests(method, path, headers, body) values(?, ?, ?, ?);");
                                        query.bind(1, std::string(j[0]["method"]));
                                        query.bind(2, std::string(j[0]["path"]));
                                        query.bind(3, std::string(j[0]["headers"]));
                                        std::string(j[0]["body"]).starts_with("{") ? j[0]["body"] : j[0]["body"] = "{}" ;
                                        query.bind(4, std::string(j[0]["body"]));
                                        query.exec();
                                    }
                                    std::lock_guard w_lck(window_mutex);
                                    w->dispatch([id, req, w](){
                                        w->resolve(id, 0, "added successfully");
                                    });
                                })
                        .detach();
                }
                catch (const std::exception &e)
                {
                    std::cerr << e.what() << '\n';
                    std::lock_guard w_lck(window_mutex);
                    w->dispatch([id, req, w](){
                        w->resolve(id, 0, "failed at inserting request");
                    });
                } }, nullptr);
    w->bind("deleteRequest", [w](const std::string &id, const std::string &req, void *) -> void
            {
                try
                {
                    std::thread([w, id, req]
                                {
                                    json j = json::parse(req);
                                    auto req_id = stoi(j[0].get<std::string>());
                                    std::lock_guard db_lck(db_mutex);
                                    SQLite::Database db("requests.db", SQLite::OPEN_READWRITE);
                                    SQLite::Statement query(db, "delete from requests where id = ?");
                                    query.bind(1, req_id);
                                    query.exec();
                                    std::lock_guard w_lck(window_mutex);
                                    w->dispatch([id, w, req](){
                                        w->resolve(id, 0, "");
                                    });
                                })
                        .detach();
                }
                catch (const std::exception &e)
                {
                    w->dispatch([id, w, req, &e](){
                        w->resolve(id, 0, e.what());
                    });
                }
            },
            nullptr);
    w->bind("updateRequest", [w](const std::string &id, const std::string &req, void*) -> void {
        try
        {
            std::thread([w, id, req](){
                json j = json::parse(req);
                std::lock_guard db_lck(db_mutex);
                SQLite::Database db("requests.db", SQLite::OPEN_READWRITE);
                SQLite::Statement query(db, "update requests set body = ?, method = ?, path = ?, headers = ? where id = ?;");
                std::cout << j[0]["method"].get<std::string>() << std::endl;
                std::cout << j[0]["body"].dump() << std::endl;

                query.bind(1, j[0]["body"].dump());
                query.bind(2, j[0]["method"].dump());
                query.bind(3, j[0]["path"].dump());
                query.bind(4, j[0]["headers"].dump());
                query.bind(5, j[0]["id"].dump());
                query.exec();
                w->dispatch([w, id](){
                    w->resolve(id, 0, "");
                });
            }).detach();
        }
        catch(const std::exception& e)
        {
            std::cerr << e.what() << '\n';
        }
        
    }, nullptr);
    w->run();
    return 0;
}
