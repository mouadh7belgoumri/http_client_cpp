#include <iostream>
#include "../lib/httplib.h"
#include <webview/webview.h>
#include "../lib/index_html.h"
#include <nlohmann/json.hpp>
#include <thread>
#include <SQLiteCpp/SQLiteCpp.h>
#include <fstream>
#include <functional>


void spinup_srv()
{
    httplib::Client cli("localhost", 8080);
}
// void spinup_and_pupulate_req_db(){
//     SQLite::Database db("requests.db", SQLite::OPEN_READWRITE|SQLite::OPEN_CREATE);
//     db.exec("CREATE TABLE IF NOT EXISTS requests (id INTEGER PRIMARY KEY, method TEXT, path TEXT, headers TEXT, body TEXT)");
//     db.exec("INSERT INTO requests (method, path, headers, body) VALUES ('GET', '/api/data', '{\"Content-Type\": \"application/json\"}', '{\"key\": \"value\"}')");
// }



using json = nlohmann::json;

int main(int, char **)
{   
    std::function<void()> f;
    webview::webview w(false, nullptr);
    w.set_title("http_client_cpp");
    w.set_size(1200, 900, WEBVIEW_HINT_NONE);
    w.set_html(html);
    w.bind("makeFile", [&](std::string arg) ->std::string {
        json j = json::parse(arg);
        return json({{"message", "hello it worked, you sent:"}, {"data", j}}).dump();
    });
    w.bind("getRequests", [&](const std::string &arg,const std::string &req, void*){
        SQLite::Database db("requests.db", SQLite::OPEN_READONLY);
        SQLite::Statement query(db, "SELECT method, path, headers, body FROM requests");
        json j = json::array();
        while (query.executeStep()) {
            json req = {
                {"method", query.getColumn(0).getString()},
                {"path", query.getColumn(1).getString()},
                {"headers", json::parse(query.getColumn(2).getString())},
                {"body", json::parse(query.getColumn(3).getString())}
            };
            j.push_back(req);
            std::cout << "Fetched request: " << req.dump(4) << std::endl;
        }
    }, nullptr);
    
    w.run();
    return 0;
}
