# For Windows (build.bat):
@echo off
echo Building application...
call npm run build
echo Building package...
call npm run package
echo Build complete!
pause

# For Unix/Linux/Mac (build.sh):
#!/bin/bash
echo "Building application..."
npm run build
echo "Building package..."
npm run package
echo "Build complete!"