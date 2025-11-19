#!/bin/bash

# Cloudflare R2 批量上传脚本
BUCKET_NAME="dsepp"
BASE_DIR="../public/dse_past_papers"

cd "$(dirname "$0")"

echo "开始上传文件到 R2..."
echo "Bucket: $BUCKET_NAME"
echo "Base Directory: $BASE_DIR"
echo ""

# 计数器
total=0
success=0
failed=0

# 递归查找所有 PDF 文件并上传
find "$BASE_DIR" -type f -name "*.pdf" | while read -r file; do
    # 获取相对路径（去掉 ../public/ 前缀）
    relative_path="${file#$BASE_DIR/}"
    
    # 构建 R2 对象路径
    object_path="$BUCKET_NAME/dse_past_papers/$relative_path"
    
    total=$((total + 1))
    
    echo "[$total] 上传: $relative_path"
    
    # 上传文件
    if wrangler r2 object put "$object_path" --file="$file" --content-type="application/pdf" > /dev/null 2>&1; then
        success=$((success + 1))
        echo "  ✓ 成功"
    else
        failed=$((failed + 1))
        echo "  ✗ 失败"
    fi
    
    # 每 10 个文件显示一次进度
    if [ $((total % 10)) -eq 0 ]; then
        echo ""
        echo "进度: $total 个文件已处理 (成功: $success, 失败: $failed)"
        echo ""
    fi
done

echo ""
echo "========================================="
echo "上传完成！"
echo "总计: $total 个文件"
echo "成功: $success 个"
echo "失败: $failed 个"
echo "========================================="

