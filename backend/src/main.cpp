#include <iostream>
#include <webview/webview.h>
#include "../lib/index_html.h"
#include <nlohmann/json.hpp>
#include <thread>
#include <SQLiteCpp/SQLiteCpp.h>
#include <mutex>

// void spinup_and_pupulate_req_db()
// {
//     SQLite::Database db("requests.db", SQLite::OPEN_READWRITE | SQLite::OPEN_CREATE);
//     db.exec("CREATE TABLE IF NOT EXISTS requests (id INTEGER PRIMARY KEY, method TEXT, path TEXT, headers TEXT, body TEXT)");
//     db.exec("INSERT INTO requests (method, path, headers, body) VALUES ('GET', '/api/data', '{\"Content-Type\": \"application/json\"}', '{\"key\": \"value\"}')");
// }

using json = nlohmann::json;
std::mutex glbl_mutex;

int main(int, char **)
{

    webview::webview w(false, nullptr);
    w.set_title("http_client_cpp");
    w.set_size(1200, 900, WEBVIEW_HINT_NONE);
    w.set_html(html);
    w.bind("getRequests", [&](const std::string &id, const std::string &req, void *)
           { std::thread([&]()
                         {
            SQLite::Database db{"requests.db", SQLite::OPEN_READONLY};
            json j = json::array();
            SQLite::Statement query{db, "SELECT method, path, headers, body FROM requests"};
            while (query.executeStep()) {
                json req_json;
                req_json["method"] = query.getColumn(0).getString();
                req_json["path"] = query.getColumn(1).getString();
                req_json["headers"] = json::parse(query.getColumn(2).getString());
                req_json["body"] = json::parse(query.getColumn(3).getString());
                j.push_back(req_json);
            }
            std::lock_guard<std::mutex> lock(glbl_mutex);
            w.resolve(id, 0, j.dump()); })
                 .detach(); }, nullptr);
    std::lock_guard<std::mutex> lock(glbl_mutex);
    w.run();
    return 0;
}
