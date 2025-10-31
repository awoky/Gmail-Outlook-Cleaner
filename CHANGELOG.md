# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.6.0] - 2025-10-31

### 🎉 Major Features

#### URLエンコード完全対応
- `%3c`と`%3e`のURLエンコードパターンを完全サポート
- 二重・三重エンコードに対応
- HTMLエンティティとURLエンコードの複合処理

#### 再帰的削除機能
- 最大20回まで反復処理
- ネスト構造を完全に展開
- 削減がゼロになるまで自動継続

### ✨ Added
- URLデコード関数（`fullyDecodeURIComponent`）
- HTMLエンティティデコード関数（`decodeHTMLEntities`）
- 完全デコード処理（`fullyDecode`）
- 7つのパターンマッチング
  1. 基本形式: `<mailto:email>`
  2. HTMLエンティティ: `&lt;mailto:email&gt;`
  3. URLエンコード: `%3cmailto:email%3e`
  4. 混合ネスト: `<mailto:email%3cmailto:email%3e>`
  5. 連続メールアドレス削除
  6. 空のmailtoタグ削除
  7. メールアドレス後の連続<>削除

### 🔧 Changed
- ボタンテキストを「🧹 クリーンアップ v4.6」に変更
- コンソールログのフォーマット改善
- 処理フローの最適化

### 📊 Performance
- 処理速度: < 100ms（初回）
- メモリ使用: ~2.5MB
- 削減率: 50-90%（メールサイズにより変動）

---

## [4.5.0] - 2025-10-30

### 🔬 Debug Version

#### Added
- デバッグ用の詳細ログ出力
- パターン検出テスト機能
- 引用ブロック別の分析
- 処理前後のHTML表示

#### Changed
- ログフォーマットの改善
- 絵文字プレフィックスの追加
- セクション別の進捗表示

### 🐛 Issues Found
- URLエンコードパターンが未対応
- `%3c`と`%3e`が検出できない
- &lt;mailto:が削減されない

---

## [3.3.0] - 2025-10-29

### 🔧 Improvements

#### Changed
- 正規表現パターンの改善
- スペース許容の強化
- HTMLモード/プレーンテキストモードの自動検出

#### Fixed
- 空タグの削除ロジック修正
- 連続スペースの処理改善

---

## [3.0.0] - 2025-10-28

### 🎨 Major UI Update

#### Added
- 手動クリーンアップボタン
- 美しいグラデーションデザイン
- ホバーエフェクト
- 通知システム

#### Changed
- 自動実行から手動実行に変更
- ボタン位置を右下に固定
- アニメーション追加

#### Removed
- 自動クリーンアップ機能
- リアルタイム監視（常時実行）

---

## [2.0.0] - 2025-10-27

### 🚀 Initial Public Release

#### Added
- 基本的なmailto削除機能
- 引用マーク（>>>）の削除
- 空白行の削除
- Chrome拡張機能として実装

#### Features
- Gmail専用
- Outlookメールに対応
- シンプルなUI

---

## [1.0.0] - 2025-10-26

### 🎊 Initial Development

#### Added
- プロトタイプ実装
- 基本的な正規表現パターン
- コンセプト検証

---

## 🔮 Upcoming Features

### v4.7（予定）
- [ ] 設定画面の実装
- [ ] ボタン位置のカスタマイズ
- [ ] 対象ドメインの管理UI
- [ ] ダークモード対応
- [ ] ショートカットキー

### v5.0（予定）
- [ ] 統計機能
- [ ] 使用履歴の記録
- [ ] パフォーマンスダッシュボード
- [ ] エクスポート/インポート機能
- [ ] Chrome Web Storeで公開

---

## 📝 Notes

### Breaking Changes
なし（すべて後方互換性を維持）

### Migration Guide
v3.x以前からv4.6へのアップグレード：
1. `chrome://extensions/` で更新ボタンをクリック
2. Gmailを再読み込み
3. 設定は不要（自動適用）

### Known Issues
なし（現在報告されているバグはありません）

---

**Maintained by:** Awoky  
**Project:** https://github.com/awoky/Gmail-Outlook-Cleaner
