安装依赖 在项目文件夹下打开终端，运行以下命令安装项目所需依赖：

npm install


Windows（PowerShell）：

$env:GOOGLE_APPLICATION_CREDENTIALS = ".\speech-to-text-interface-fa7162affa01.json"

Mac/Linux：

export GOOGLE_APPLICATION_CREDENTIALS="./speech-to-text-interface-fa7162affa01.json"


运行以下命令启动服务器：

node server.js

如果配置正确，终端会显示：

Server is running on http://localhost:3000
