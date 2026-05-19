#include <iostream>
#include <nlohmann/json.hpp>
#include <SQLiteCpp/SQLiteCpp.h>
#include "../lib/getRequests.h"
using json = nlohmann::json;


getRequests::getRequests(std::shared_ptr<webview::webview> w, std::mutex& window_mutex, std::mutex &database_mutex)
    :m_window{w}, w_mutex{window_mutex}, db_mutex{database_mutex}{}
void getRequests::operator()(std::string id, std::string req, void *args)
{
    auto m_window_copy = m_window;
    std::mutex& db_mutex_copy = db_mutex;
    std::mutex& w_mutex_copy = w_mutex;
    std::thread([m_window_copy, &db_mutex_copy, &w_mutex_copy, id, req]()
                {
                             try
                             {
                                 
                                 std::lock_guard<std::mutex> db_lock(db_mutex_copy);
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
                                 std::lock_guard w_lck(w_mutex_copy);
                                 m_window_copy->dispatch([m_window_copy, id, j]()
                                 {
                                     m_window_copy->resolve(id, 0, j.dump());
                                 });
                             }
                             catch (const std::exception& e)
                             {
                                std::cerr << e.what() << '\n';
                                std::cout << "Error retrieving requests from database." << std::endl;
                                std::lock_guard w_lck(w_mutex_copy);
                                m_window_copy->dispatch([id, e, m_window_copy]()
                                 {
                                     m_window_copy->resolve(id, 1, std::string(e.what()));
                                 });
                             } })
        .detach();
}


getRequests::getRequests(const getRequests& g):w_mutex(g.w_mutex), db_mutex(g.db_mutex){std::cout << "hello world\n";}
