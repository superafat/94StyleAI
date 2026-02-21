# 94StyleAI 網站設計優化任務

## 專案位置
`/Users/dali/.openclaw/agents/jiangziya/workspace/94style-ai`

## 任務目標
重新設計 94StyleAI 網站，改為現代柔和風格

## 設計風格

### 1. 莫蘭迪色系（主要）
- 主色：#B8C5D6（灰藍）
- 輔色：#D4B483（暖米）
- 點綴：#C9B8A8（奶茶）
- 背景：#F5F2EB（暖白）
- 其他：#E8B4B8, #A8D5BA, #D4AF37

### 2. Chibi 風格 (Claymorphism)
- 柔和圓角（rounded-3xl）
- 黏土立體感陰影
- 俏皮圖標

### 3. 宮崎駿風格
- 自然田園元素
- 柔和漸變
- 雲朵/綠植裝飾

### 4. 動物森友會風格
- 明亮可爱
- Y2K 元素
- 繽紛但柔和的點綴

## 技術要求

### Tailwind CSS 配置
在 `globals.css` 中添加：
```css
@theme {
  --color-morandi-primary: #B8C5D6;
  --color-morandi-secondary: #D4B483;
  --color-morandi-accent: #C9B8A8;
  --color-morandi-bg: #F5F2EB;
  --color-morandi-rose: #E8B4B8;
  --color-morandi-green: #A8D5BA;
  --color-morandi-gold: #D4AF37;
}
```

### 動畫效果
- 過渡：transition-all duration-300
- 陰影：shadow-lg shadow-morandi-primary/20
- 懸停：hover:scale-105 hover:shadow-xl

### 響應式
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Large: 1440px

## 頁面元件設計

### 1. Hero 區塊
- 大標題：柔和渐变文字
- 副標題：簡潔有力
- CTA 按鈕：圓角 + 陰影 + 懸停動畫
- 裝飾：雲朵/星星動畫

### 2. 功能展示
- 卡片式布局
- 圖標：可愛風格
- 敘述：清晰簡短

### 3. 流程展示
- 步驟圖：可愛圖標
- 連接線：柔和曲線

### 4. 尾部
- 聯絡資訊
- 社群連結
- 版權宣告

## 禁止事項
- 過於鮮豔的霓虹色
- 粗糙動畫
- 生硬邊角

## 完成標準
1. 修改 `src/app/globals.css` - 添加莫蘭迪配色
2. 修改 `src/app/page.tsx` - 全新 UI 設計
3. `npm run build` 成功
4. 響應式測試通過

## 部署指令（完成後執行）
```bash
cd /Users/dali/.openclaw/agents/jiangziya/workspace/94style-ai
npm run build
gcloud builds submit . --tag gcr.io/cch-beautifier/94style-ai-frontend:v2 --project cch-beautifier
gcloud run deploy styleai --image gcr.io/cch-beautifier/94style-ai-frontend:v2 --region asia-east1 --project cch-beautifier --allow-unauthenticated --port 3000
```
