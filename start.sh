#!/bin/bash

# Check if email_sender.py is already running
PID=$(pgrep -f "python3 email_sender.py")

if [ -n "$PID" ]; then
  echo "⚠️  이미 이메일 발송 서비스가 실행 중입니다. (PID: $PID)"
  echo "중지하려면 다음 명령어를 실행하세요: kill $PID"
  exit 1
fi

# Start the script in the background
nohup python3 email_sender.py > email.log 2>&1 &

# Get the new PID
NEW_PID=$!

echo "✅ 이메일 서버가 백그라운드에서 시작되었습니다. (PID: $NEW_PID)"
echo "📄 로그는 email.log 파일에서 확인할 수 있습니다."
