#!/bin/bash

# 重试失败的文件
BUCKET_NAME="dsepp"
BASE_DIR="../public/dse_past_papers"
FAILED_LIST="failed-files.txt"

cd "$(dirname "$0")"

echo "🔄 重试失败的文件..."
echo ""

success=0
failed=0
total=$(wc -l < "$FAILED_LIST")

while IFS= read -r relative_path; do
    file="$BASE_DIR/$relative_path"
    
    if [ ! -f "$file" ]; then
        echo "✗ 文件不存在: $relative_path"
        ((failed++))
        continue
    fi
    
    echo "[$((success + failed + 1))/$total] 重试: $relative_path"
    
    if wrangler r2 object put "$BUCKET_NAME/dse_past_papers/$relative_path" \
        --file="$file" \
        --content-type="application/pdf" \
        --remote > /dev/null 2>&1; then
        echo "  ✓ 成功"
        ((success++))
    else
        echo "  ✗ 仍然失败"
        ((failed++))
    fi
    
    # 避免速率限制
    sleep 0.1
done < "$FAILED_LIST"

echo ""
echo "========================================="
echo "重试完成！"
echo "成功: $success"
echo "失败: $failed"
echo "========================================="

