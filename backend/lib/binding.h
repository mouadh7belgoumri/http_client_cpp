#ifndef BINDING_H
#define BINDING_H
#include <string>

class binding
{
public:
    binding() =default;
    binding(const binding &) = delete;
    binding operator=(const binding &) = delete;
    binding operator=(binding &&) = delete;
    virtual void operator()(std::string, std::string, void *) = 0;
};





#endif