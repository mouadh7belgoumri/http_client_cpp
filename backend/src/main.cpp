#include <iostream>
#include "../lib/httplib.h"
#include <webview/webview.h>
#include "../lib/index_html.h"
#include <nlohmann/json.hpp>
#include <thread>
#include <SQLiteCpp/SQLiteCpp.h>
#include <memory>

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
                                 while (query.executeStep())
                                 {
                                     json req_json;
                                     req_json["method"] = query.getColumn(0).getString();
                                     req_json["path"] = query.getColumn(1).getString();
                                     req_json["headers"] = json::parse(query.getColumn(2).getString());
                                     req_json["body"] = json::parse(query.getColumn(3).getString());
                                     j.push_back(req_json);
                                 }
                                 std::cout << j.dump(10) << std::endl;
                                 w->dispatch([id, j, w]()
                                 {
                                     w->resolve(id, 0, j.dump());
                                 });
                             }
                             catch (const std::exception& e)
                             {
                                 w->dispatch([id, e, w]()
                                 {
                                     w->resolve(id, 1, std::string(e.what()));
                                 });
                             }
                         })
                 .detach(); }, nullptr);
    w->bind("sendReq", [w](const std::string &id, const std::string &req, void *)
           {
               // TODO implementing the client logic for sending requests and receiving responses here
               httplib::Client cli("http://localhost", 8000);
           },
           nullptr);
    w->run();
    return 0;
}
