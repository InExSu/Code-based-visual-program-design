sudo chown -R $(whoami):$(id -gn) .
find . -name "*.sh" -exec chmod +x {} +