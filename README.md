# VRS Garden Dhaba Billing Software / VRS கார்டன் தாபா பில்லிங் மென்பொருள்

This is a complete, fully customized restaurant billing software for VRS Garden Dhaba.
இது VRS கார்டன் தாபாவுக்கான முழுமையான மற்றும் தனிப்பயனாக்கப்பட்ட உணவக பில்லிங் மென்பொருள்.

## Features / சிறப்பம்சங்கள்
- 🌐 **Two Languages / இரு மொழிகள்**: Tamil & English toggle.
- 🎙️ **Voice Input / குரல் வழி உள்ளீடு**: Simulate adding items via Tamil speech. (OpenAI Whisper integration ready).
- 🖨️ **Receipt Printing / ரசீது அச்சிடுதல்**: Built-in format for 80mm generic thermal printers.
- 📱 **Responsive Design / அனைத்து சாதனங்களுக்கும் ஏற்ற வடிவமைப்பு**: Tablet-friendly large buttons.
- 📊 **Analytics / அறிக்கைகள்**: Daily sales metrics and Recharts graphs.
- 🪑 **Table Management / மேசை மேலாண்மை**: Live visual floor map with color codes.
- 📴 **Offline Ready / இணையம் இல்லாமல் இயங்கும்**: Uses local SQLite.

## How to Run Offline on Windows / இணையம் இல்லாமல் விண்டோஸ் கணினியில் இயக்குவது எப்படி?

### Prerequisites / தேவையானவை:
1. **Node.js** (v18+) must be installed on your Windows machine.
   (Node.js மென்பொருளை உங்கள் கணினியில் நிறுவவும்)
2. You do not need an active internet connection to run the billing flow!
   (பில்லிங் செய்வதற்கு இணைய வசதி தேவையில்லை!)

### Step 1: Start the Backend (Database & API) / பின்புல சேவையகத்தை தொடங்க:
1. Open PowerShell / Command Prompt.
   (பவர்ஷெல் அல்லது கமாண்ட் ப்ராம்ட் திறக்கவும்)
2. Navigate to the `backend` folder:
   ```cmd
   cd "backend"
   ```
3. Run the server:
   ```cmd
   npm start
   ```
   *This starts the SQLite database and local API at http://localhost:5000*
   (இது உள்ளூர் தரவுத்தளத்தை இயக்கும்)

### Step 2: Start the Frontend (UI) / முன்புற மென்பொருளை தொடங்க:
1. Open another PowerShell / Command Prompt.
   (மற்றொரு கமாண்ட் ப்ராம்ட் திறக்கவும்)
2. Navigate to the `frontend` folder:
   ```cmd
   cd "frontend"
   ```
3. Run the frontend:
   ```cmd
   npm run dev
   ```
4. Open the displayed Local URL (e.g., http://localhost:5173 / 5174) in Google Chrome or Microsoft Edge.
   (கூகுள் குரோம் பிரவுசரில் காட்டப்படும் முகவரியை திறக்கவும்).

---

## Thermal Printer Setup / தெர்மல் பிரிண்டர் அமைப்பு
1. Install your 80mm thermal printer windows drivers and set it as the **Default Printer**.
   (உங்களது 80mm தெர்மல் பிரிண்டரை கணினியின் 'Default Printer' ஆக அமைக்கவும்).
2. On the Print dialogue (Ctrl+P or when clicking 'Pay Bill'):
   - Set **Paper Size**: 80mm Roll
   - Set **Margins**: None / Minimum
   - Uncheck **Headers and footers**
   (பிரிண்ட் செட்டிங்ஸில் மேலே உள்ளவாறு மாற்றவும்).

## Connecting OpenAI Whisper API (Voice) / குரல் வழிக்கான OpenAI இணைப்பு
While voice input is currently simulated to add "Parotta and Meals" locally, you can connect the real OpenAI Whisper API:
1. Go to `BillingScreen.tsx` in `startVoiceInput` function.
2. Replace the `setTimeout` with a real recording blob.
3. Send to API: `https://api.openai.com/v1/audio/transcriptions` with model `whisper-1` and language `ta`.
4. Parse the extracted Tamil text to automatically select IDs.

## Initial Login PINs / ஆரம்ப லாகின் விவரங்கள்
- **Owner / உரிமையாளர்**: 1234

Enjoy using VRS Garden Dhaba Manager!
