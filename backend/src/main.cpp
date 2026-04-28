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
                                 SQLite::Database db{"requests.db", SQLite::OPEN_READONLY};
                                 json j = json::array();
                                 SQLite::Statement query{db, "SELECT method, path, headers, body FROM requests"};
                                 int i = 0;
                                 while (query.executeStep())
                                 {
                                     json req_json;
                                     req_json["method"] = query.getColumn(0).getString();
                                     req_json["path"] = query.getColumn(1).getString();
                                     req_json["headers"] = json::parse(query.getColumn(2).getString());
                                     req_json["body"] = json::parse(query.getColumn(3).getString());
                                     j.push_back(req_json);
                                     i++;
                                     
                                 }

                                 w->dispatch([id, j, w]()
                                 {
                                     w->resolve(id, 0, j.dump());
                                 });
                             }
                             catch (const std::exception& e)
                             {
                                std::cerr << e.what() << '\n';
                                std::cout << "Error retrieving requests from database." << std::endl;
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
                        auto res = cli.Get(route);
                        json res_json;
                        if (res) {
                            res_json["status"] = res->status;
                            res_json["headers"] = res->headers;
                            res_json["body"] = res->body;
                        } else {
                            res_json["error"] = "Request failed";
                        }
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
    w->bind("createRequest", [w](const std::string &id,const std::string &req, void *){
        std::thread([w, id, req](){
            json j = json::parse(req);
            SQLite::Database db("requests,db", SQLite::OPEN_READWRITE);
            SQLite::Statement query (db, "insert into requests(method, path, headers, body) values(?, ?, ?, ?);");
            query.bind(1, std::string(j[0]["method"]));
            query.bind(2, std::string(j[0]["path"]));
            query.bind(3, std::string(j[0]["headers"]));
            query.bind(4, std::string(j[0]["body"]));
            query.exec();
            
        }).detach();
    }, nullptr);
        w->run();
    return 0;
}
