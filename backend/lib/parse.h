#include <iostream>
bool starts_with(const std::string &str, const std::string &prefix)
{
    return str.rfind(prefix, 0) == 0;
}

std::string split (const std::string &str, char delimiter)
{
    size_t pos = str.find(delimiter);
    if (pos == std::string::npos)
        return str;
    return str.substr(0, pos);
}