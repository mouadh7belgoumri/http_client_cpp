#include <iostream>
#include "../lib/httplib.h"
#include <webview/webview.h>
#include "../lib/index_html.h"
#include <nlohmann/json.hpp>
#include <thread>
#include <SQLiteCpp/SQLiteCpp.h>
#include <memory>
#include "../lib/parse.h"

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
                                     std::cout << "Method: " << i << "fetched from database " << std::endl;
                                     req_json["path"] = query.getColumn(1).getString();
                                        std::cout << "Path: " << i << "fetched from database " << std::endl;
                                     req_json["headers"] = json::parse(query.getColumn(2).getString());
                                        std::cout << "Headers: " << i << "fetched from database " << std::endl;
                                     req_json["body"] = json::parse(query.getColumn(3).getString());
                                        std::cout << "Body: " << i << "fetched from database " << std::endl;
                                     j.push_back(req_json);
                                     i++;
                                     
                                 }
                                 std::cout << j.dump(10) << std::endl;
                                 std::cout << "Requests retrieved from database." << std::endl;
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
                        std::cout << req_json.dump(10) << std::endl;
                        auto port_size = req_json[0]["path"].get<std::string>().find('/');
                        auto host = split(req_json[0]["path"].get<std::string>(), ':');
                        std::cout << "Host: " << host << std::endl;
                        httplib::Client cli(host.c_str());
                        httplib::Headers headers;
                        for (auto& header : req_json[0]["headers"].items()) {
                            headers.insert({header.key(), header.value().get<std::string>()});
                        }
                        auto res = cli.Get("https://jsonplaceholder.typicode.com/todos/1");
                        json res_json;
                        if (res) {
                            res_json["status"] = res->status;
                            res_json["headers"] = res->headers;
                            res_json["body"] = res->body;
                        } else {
                            res_json["error"] = "Request failed";
                        }
                        std::cout << res_json.dump(10) << std::endl;
                        
                        w->dispatch([id, req_json, w]()
                        {
                            w->resolve(id, 0, req_json.dump());
                        });
                    }).detach();
                }
                catch (const std::exception &e)
                {
                    std::cerr << e.what() << '\n';
                } }, nullptr);
    w->run();
    return 0;
}
