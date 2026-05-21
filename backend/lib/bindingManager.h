#ifndef BINDING_MANAGER_H
#define BINDING_MANAGER_H
#include <iostream>
#include <mutex>
#include <webview/webview.h>

class bindingManager
{
private:
    webview::webview m_window;
    std::mutex m_window_mutex;
    std::mutex m_db_mutex;
public:
    bindingManager();
    ~bindingManager();
    void getRequests(const std::string&,const std::string&, void*);
};

#endif