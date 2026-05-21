#include <thread>
#include <SQLiteCpp/SQLiteCpp.h>
#include <nlohmann/json.hpp>
#include "../lib/bindingManager.h"
using json = nlohmann::json;
void bindingManager::getRequestsWorker(const std::string &id, const std::string &req, void *arg)
{
    {
        try
        {

            std::lock_guard<std::mutex> db_lock(m_db_mutex);
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
            std::lock_guard w_lck(m_window_mutex);
            m_window->dispatch([m_window, id, j]()
                               { m_window->resolve(id, 0, j.dump()); });
        }
        catch (const std::exception &e)
        {
            std::cerr << e.what() << '\n';
            std::cout << "Error retrieving requests from database." << std::endl;
            std::lock_guard w_lck(w_mutex_copy);
            m_window->dispatch([id, e, m_window]()
                               { m_window->resolve(id, 1, std::string(e.what())); });
        }
    }
}
void bindingManager::getRequests(const std::string &id, const std::string &req, void *arg)
{
    std::thread([id, req]()
                {
                             try
                             {
                                 
                                 std::lock_guard<std::mutex> db_lock(m_db_mutex);
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
                                 m_window->dispatch([m_window, id, j]()
                                 {
                                     m_window->resolve(id, 0, j.dump());
                                 });
                             }
                             catch (const std::exception& e)
                             {
                                std::cerr << e.what() << '\n';
                                std::cout << "Error retrieving requests from database." << std::endl;
                                std::lock_guard w_lck(w_mutex_copy);
                                m_window->dispatch([id, e, m_window]()
                                 {
                                     m_window->resolve(id, 1, std::string(e.what()));
                                 });
                             } })
        .detach();
}