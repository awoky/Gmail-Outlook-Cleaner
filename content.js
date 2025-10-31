// Gmail Outlook Reply Cleaner v4.6 - URLエンコード完全対応版

(function() {
  'use strict';

  const buttonStyle = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: none;
  `;

  // URLデコードを複数回実行して完全に展開
  function fullyDecodeURIComponent(str) {
    let decoded = str;
    let previousDecoded;
    let iterations = 0;
    const maxIterations = 10; // 無限ループ防止
    
    do {
      previousDecoded = decoded;
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {
        // デコードエラーの場合は現在の状態を返す
        break;
      }
      iterations++;
    } while (decoded !== previousDecoded && iterations < maxIterations);
    
    return decoded;
  }

  // HTMLエンティティを実際の文字に変換
  function decodeHTMLEntities(str) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  }

  // 完全なデコード処理
  function fullyDecode(str) {
    // まずHTMLエンティティをデコード
    let decoded = decodeHTMLEntities(str);
    // 次にURLエンコードをデコード
    decoded = fullyDecodeURIComponent(decoded);
    // もう一度HTMLエンティティをデコード（二重エンコード対応）
    decoded = decodeHTMLEntities(decoded);
    return decoded;
  }

  // mailto構造の完全削除
  function removeMailtoStructures(html) {
    console.log('\n🗑️ mailto構造の完全削除開始');
    
    let cleaned = html;
    let iteration = 0;
    const maxIterations = 20;
    
    while (iteration < maxIterations) {
      const beforeLength = cleaned.length;
      
      // パターン1: 基本的なmailto（<mailto:email>）
      cleaned = cleaned.replace(
        /<mailto:([^>]+)>/gi,
        (match, email) => {
          // メールアドレスだけを残す
          const decodedEmail = fullyDecode(email);
          return decodedEmail;
        }
      );
      
      // パターン2: HTMLエンティティ版（&lt;mailto:email&gt;）
      cleaned = cleaned.replace(
        /&lt;mailto:([^&]+)&gt;/gi,
        (match, email) => {
          const decodedEmail = fullyDecode(email);
          return decodedEmail;
        }
      );
      
      // パターン3: URLエンコード版（%3cmailto:email%3e）
      cleaned = cleaned.replace(
        /%3cmailto:([^%]+)%3e/gi,
        (match, email) => {
          const decodedEmail = fullyDecode(email);
          return decodedEmail;
        }
      );
      
      // パターン4: 混合版（<mailto:email%3cmailto:email%3e>）
      cleaned = cleaned.replace(
        /<mailto:([^>]+%3c[^>]+)>/gi,
        (match, email) => {
          const decodedEmail = fullyDecode(email);
          return decodedEmail;
        }
      );
      
      // パターン5: 連続するメールアドレス削除
      cleaned = cleaned.replace(
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(<[^>]*>)+\1/gi,
        '$1'
      );
      
      // パターン6: 空のmailtoタグ
      cleaned = cleaned.replace(/<mailto:>/gi, '');
      cleaned = cleaned.replace(/&lt;mailto:&gt;/gi, '');
      cleaned = cleaned.replace(/%3cmailto:%3e/gi, '');
      
      // パターン7: メールアドレス後の連続<>削除
      cleaned = cleaned.replace(
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(<[^>]*>){2,}/gi,
        '$1'
      );
      
      const afterLength = cleaned.length;
      const reduction = beforeLength - afterLength;
      
      if (reduction === 0) {
        console.log(`✅ mailto削除完了: ${iteration + 1}回の反復`);
        break;
      }
      
      console.log(`  反復 ${iteration + 1}: ${reduction}文字削減`);
      iteration++;
    }
    
    return cleaned;
  }

  // 引用マーク削除
  function removeExcessiveQuotes(html) {
    console.log('\n📝 引用マーク削除開始');
    const before = html.length;
    
    // >>> の連続を1つに
    let cleaned = html.replace(/(>\s*){3,}/g, '> ');
    cleaned = cleaned.replace(/(&gt;\s*){3,}/g, '&gt; ');
    
    const after = cleaned.length;
    if (after < before) {
      console.log(`✅ 引用マーク: ${before - after}文字削減`);
    }
    
    return cleaned;
  }

  // 空タグ削除
  function removeEmptyTags(html) {
    console.log('\n🧹 空タグ削除開始');
    const before = html.length;
    
    let cleaned = html;
    // 空タグの削除
    cleaned = cleaned.replace(/<\s*>/g, '');
    cleaned = cleaned.replace(/&lt;\s*&gt;/g, '');
    
    // 連続する空白削除
    cleaned = cleaned.replace(/(&nbsp;\s*){4,}/gi, '&nbsp; ');
    cleaned = cleaned.replace(/ {5,}/g, ' ');
    
    const after = cleaned.length;
    if (after < before) {
      console.log(`✅ 空タグ: ${before - after}文字削減`);
    }
    
    return cleaned;
  }

  // メインクリーンアップ処理
  function performCleanup(element) {
    if (!element) return { success: false, message: 'エディタが見つかりません' };

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Gmail Outlook Reply Cleaner v4.6 実行');
    console.log('🆕 URLエンコード完全対応版');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const originalHTML = element.innerHTML;
    const originalLength = originalHTML.length;
    
    console.log('📏 元の文字数:', originalLength.toLocaleString());
    
    try {
      let html = originalHTML;
      
      // ステップ1: mailto構造の完全削除
      html = removeMailtoStructures(html);
      
      // ステップ2: 引用マーク削除
      html = removeExcessiveQuotes(html);
      
      // ステップ3: 空タグ削除
      html = removeEmptyTags(html);
      
      const finalLength = html.length;
      const reduction = originalLength - finalLength;
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 最終結果:');
      console.log('  最終文字数:', finalLength.toLocaleString());
      console.log('  総削減:', reduction.toLocaleString(), '文字');
      console.log('  削減率:', ((reduction / originalLength) * 100).toFixed(1) + '%');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      if (reduction > 0) {
        element.innerHTML = html;
        const percentage = ((reduction / originalLength) * 100).toFixed(1);
        
        return {
          success: true,
          message: `✅ ${reduction.toLocaleString()}文字削減\n削減率: ${percentage}%\n\nURLエンコード対応版で処理完了！`,
          reduction: reduction
        };
      } else {
        return {
          success: false,
          message: `❌ 削除する重複が見つかりませんでした\n\nコンソールログを確認してください\n（⌘+Option+I）`
        };
      }
      
    } catch (error) {
      console.error('❌ エラー発生:', error);
      element.innerHTML = originalHTML;
      return {
        success: false,
        message: `❌ エラーが発生しました\n${error.message}\n\n元の状態に復元しました`
      };
    }
  }

  function showNotification(message, isSuccess = true) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10001;
      padding: 16px 24px;
      background: ${isSuccess ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      animation: slideIn 0.3s ease;
      max-width: 450px;
      white-space: pre-line;
      line-height: 1.6;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 6000);
  }

  function createCleanupButton() {
    const button = document.createElement('button');
    button.id = 'gmail-cleanup-button';
    button.textContent = '🧹 クリーンアップ v4.6';
    button.style.cssText = buttonStyle;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });

    button.addEventListener('click', () => {
      const editor = document.querySelector('[contenteditable="true"][role="textbox"], .editable[contenteditable="true"]');
      
      if (!editor) {
        showNotification('❌ エディタが見つかりません\n返信画面を開いてください', false);
        return;
      }

      console.clear();
      button.textContent = '🔄 処理中...';
      button.disabled = true;
      button.style.opacity = '0.7';

      setTimeout(() => {
        const result = performCleanup(editor);
        
        button.textContent = '🧹 クリーンアップ v4.6';
        button.disabled = false;
        button.style.opacity = '1';
        
        showNotification(result.message, result.success);
      }, 100);
    });

    return button;
  }

  function monitorEditors() {
    let button = document.getElementById('gmail-cleanup-button');
    
    if (!button) {
      button = createCleanupButton();
      document.body.appendChild(button);
    }

    const editor = document.querySelector('[contenteditable="true"][role="textbox"], .editable[contenteditable="true"]');
    
    if (editor && editor.offsetParent !== null) {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function initialize() {
    injectStyles();
    setInterval(monitorEditors, 1000);
    
    const pageObserver = new MutationObserver(monitorEditors);
    pageObserver.observe(document.body, { childList: true, subtree: true });
    
    monitorEditors();
    console.log('✅ Gmail Outlook Reply Cleaner v4.6 起動完了');
    console.log('🆕 URLエンコード完全対応版');
    console.log('📋 機能: <mailto:>, %3cmailto:, &lt;mailto: すべてに対応');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
