#ifndef GETREQUESTS_H
#define GETREQUESTS_H
#include <webview/webview.h>
#include <thread>
#include <mutex>

#include "./binding.h"

class getRequests : public binding
{
private:
    std::shared_ptr<webview::webview> m_window;

public:
    getRequests() = delete;
    getRequests(std::shared_ptr<webview::webview>);
    getRequests(const getRequests &);
    void operator()(std::string, std::string, void *) override;
};
#endif