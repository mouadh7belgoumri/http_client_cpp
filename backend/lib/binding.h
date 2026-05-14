#ifndef BINDING_H
#define BINDING_H
#include <webview/webview.h>

class binding {
    private:
        std::shared_ptr<webview::webview> m_window;

    public:
        binding() =delete;
        binding(const binding&) =delete;
        binding(binding&&) =delete;
        binding(std::shared_ptr<webview::webview>);
        ~binding() =default;
        binding operator=(const binding&) =delete;
        binding operator=(binding&&) =delete;
        void operator()(std::string, std::string, void*); 
};

class getRequests : public binding{
    
};

#endif