#!/bin/bash

# 并行上传脚本 - 修复版（处理特殊字符）
BUCKET_NAME="dsepp"
BASE_DIR="../public/dse_past_papers"
PARALLEL_JOBS=50

cd "$(dirname "$0")"

echo "🚀 开始并行上传文件到 R2..."
echo "Bucket: $BUCKET_NAME"
echo "并行任务数: $PARALLEL_JOBS"
echo ""

# 创建临时文件列表（使用 null 分隔符）
TEMP_FILE_LIST=$(mktemp)
find "$BASE_DIR" -type f -name "*.pdf" -print0 > "$TEMP_FILE_LIST"

TOTAL_FILES=$(tr -cd '\0' < "$TEMP_FILE_LIST" | wc -c)
echo "总文件数: $TOTAL_FILES"
echo ""

# 上传函数
upload_file() {
    local file="$1"
    local bucket="$2"
    local base_dir="$3"
    
    # 获取相对路径
    relative_path="${file#$base_dir/}"
    
    # 上传到 R2
    if wrangler r2 object put "$bucket/dse_past_papers/$relative_path" \
        --file="$file" \
        --content-type="application/pdf" \
        --remote > /dev/null 2>&1; then
        echo "✓ $relative_path"
        return 0
    else
        echo "✗ $relative_path" >&2
        return 1
    fi
}

export -f upload_file
export BUCKET_NAME
export BASE_DIR

# 使用 xargs -0 处理 null 分隔的文件名（支持特殊字符）
echo "开始上传..."
cat "$TEMP_FILE_LIST" | xargs -0 -P "$PARALLEL_JOBS" -I {} bash -c 'upload_file "$@"' _ {} "$BUCKET_NAME" "$BASE_DIR"

# 清理
rm "$TEMP_FILE_LIST"

echo ""
echo "========================================="
echo "上传完成！"
echo "========================================="

