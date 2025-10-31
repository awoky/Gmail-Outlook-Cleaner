# Gmail Outlook Reply Cleaner - Chrome Extension

## 📋 プロジェクト概要

このChrome拡張機能は、GmailでOutlookユーザーからのメールに返信する際に発生する、無限に増殖するmailtoリンクと引用マーク（`> > >`）を削除するツールです。

## 🎯 主な機能

### v4.6の特徴
- **URLエンコード完全対応**: `%3c`, `%3e`などのエンコードされたmailto構造を検出・削除
- **再帰的削除**: 最大20回の反復処理で多重ネスト構造を完全除去
- **7つのパターン対応**: 
  1. `<mailto:email>` - 基本形式
  2. `&lt;mailto:email&gt;` - HTMLエンティティ
  3. `%3cmailto:email%3e` - URLエンコード
  4. 混合ネスト形式
  5. 連続メールアドレス
  6. 空タグ
  7. 連続<>削除

## 🏗️ 技術スタック

- **Platform**: Chrome Extension Manifest V3
- **Language**: JavaScript (ES6+)
- **Architecture**: Content Script + Background監視
- **Framework**: Vanilla JS (no dependencies)

## 📁 ファイル構成

```
gmail-v42-final/
├── manifest.json       # Chrome拡張機能の設定
├── content.js         # メインロジック（v4.6）
├── icon*.png          # 拡張機能アイコン
├── CLAUDE.md          # このファイル（プロジェクト文脈）
└── *.md               # ドキュメント各種
```

## 🔧 開発規約

### コーディングスタイル
- Pure JavaScript（ライブラリ依存なし）
- 関数型プログラミングスタイル
- 詳細なコンソールログ出力（絵文字プレフィックス使用）
- エラーハンドリング必須

### 命名規則
- 関数名: camelCase（例: `removeMailtoStructures`）
- 定数: UPPER_SNAKE_CASE（例: `MAX_ITERATIONS`）
- ユーザー向けメッセージ: 日本語
- 技術ログ: 日本語 + 絵文字

### 重要な制約
- **絶対に自動実行しない**: ユーザーが手動でボタンをクリックした時のみ動作
- **元の状態を保持**: エラー時は必ず`originalHTML`に復元
- **段階的処理**: デコード → 削除 → クリーンアップの順序を守る

## 🧪 テスト対象

### パターン1: 基本的なOutlookメール
```
<mailto:email@domain.com>
```

### パターン2: URLエンコード版
```
%3cmailto:email@domain.com%3e
```

### パターン3: 多重ネスト（最難関）
```
<mailto:email<mailto:email%3cmailto:email%3e>>
```

### パターン4: 引用マーク
```
> > > > > > > > > Text
```
→ `> Text` に削減

## 📊 期待される削減率

- 通常: 30-50%
- 複数往復: 50-70%
- 極度肥大化: 70-90%

## 🐛 既知の問題と解決済み

### ✅ v4.6で解決
- URLエンコードされたネスト構造の検出失敗
- &lt;mailto:&gt; の残存問題
- 大量の重複パターンの処理遅延

## 🚀 次の改善案

1. **パフォーマンス最適化**: チャンク処理の導入
2. **ユーザー設定**: カスタムメールアドレスリスト
3. **統計機能**: 累計削減文字数の表示
4. **ホワイトリスト**: 特定パターンの除外

## 💡 開発のヒント

### デバッグ方法
1. Gmailを開く
2. ⌘+Option+I でコンソールを開く
3. 拡張機能実行
4. 絵文字プレフィックスでログを追跡

### 正規表現のテスト
```javascript
// パターンのテスト例
const testHtml = '<mailto:test@example.com>';
const regex = /<mailto:([^>]+)>/gi;
console.log(regex.test(testHtml)); // true
```

### Chrome拡張機能の更新
```bash
# chrome://extensions/ で更新ボタンをクリック
# または
open -a "Google Chrome" "chrome://extensions/"
```

## 📚 参考リソース

- Chrome Extension API: https://developer.chrome.com/docs/extensions/
- Manifest V3: https://developer.chrome.com/docs/extensions/mv3/
- Content Scripts: https://developer.chrome.com/docs/extensions/mv3/content_scripts/

## 👤 開発者

**Awoky**  
AOI Pro. - Video Producer & AI Adoption Leader

## 🔄 バージョン履歴

- **v4.6** (2025-10-31): URLエンコード完全対応
- **v4.5** (2025-10-30): デバッグ版
- **v3.x**: 基本機能実装

---

**重要**: このプロジェクトはGmailのプレーンテキストモードに最適化されています。HTMLモードでも動作しますが、主な用途はプレーンテキストモードです。
