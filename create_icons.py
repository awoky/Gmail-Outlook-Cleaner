#!/usr/bin/env python3
"""
Gmail Outlook Reply Cleaner - アイコン生成スクリプト
シンプルなアイコンを生成します
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("PILモジュールが必要です: pip install Pillow")
    exit(1)

def create_icon(size, filename):
    """アイコンを生成"""
    # 背景色（青系）
    bg_color = (66, 133, 244)  # Google Blue
    
    # 画像を作成
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # 白い「清掃」マークを描画（ほうきのようなイメージ）
    # シンプルな✓マークを描画
    white = (255, 255, 255)
    
    if size >= 128:
        # 大きいアイコン用
        # チェックマークを描画
        points = [
            (size * 0.25, size * 0.5),
            (size * 0.45, size * 0.7),
            (size * 0.75, size * 0.3)
        ]
        draw.line(points, fill=white, width=max(8, size // 16))
        
        # "X" を描画して「削除」を表現
        margin = size * 0.15
        x_size = size * 0.2
        x_x = size * 0.70
        x_y = size * 0.60
        
        draw.line([
            (x_x, x_y),
            (x_x + x_size, x_y + x_size)
        ], fill=(244, 67, 54), width=max(6, size // 20))
        
        draw.line([
            (x_x + x_size, x_y),
            (x_x, x_y + x_size)
        ], fill=(244, 67, 54), width=max(6, size // 20))
    
    elif size >= 48:
        # 中サイズアイコン用
        points = [
            (size * 0.25, size * 0.5),
            (size * 0.45, size * 0.7),
            (size * 0.75, size * 0.35)
        ]
        draw.line(points, fill=white, width=4)
    
    else:
        # 小さいアイコン用
        points = [
            (size * 0.3, size * 0.5),
            (size * 0.45, size * 0.65),
            (size * 0.7, size * 0.4)
        ]
        draw.line(points, fill=white, width=2)
    
    # 保存
    img.save(filename, 'PNG')
    print(f"✓ {filename} を作成しました ({size}x{size})")

def main():
    """メイン処理"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("Gmail Outlook Reply Cleaner - アイコン生成中...")
    print()
    
    # 3つのサイズのアイコンを生成
    create_icon(16, os.path.join(script_dir, 'icon16.png'))
    create_icon(48, os.path.join(script_dir, 'icon48.png'))
    create_icon(128, os.path.join(script_dir, 'icon128.png'))
    
    print()
    print("すべてのアイコンを生成しました！")
    print("拡張機能をChromeに読み込むことができます。")

if __name__ == '__main__':
    main()
