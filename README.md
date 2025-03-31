# 🧠 Adaptive Math Activities Web App for Kids

This project is a responsive and interactive web application designed to help 10-year-old children practice math in a fun and engaging way. Activities are generated dynamically using AI (Groq API) and presented with cartoon or video game themes.

---

## 🚀 Features

- 🧠 AI-generated math activities with one-variable equations
- 🎮 Fun contexts: Mario, Sonic, Peppa Pig, Minecraft, Pokémon
- ✅ Multiple-choice with immediate feedback (SweetAlert2 toasts)
- ✏️ Edit any activity (question and options)
- 🔀 Drag & drop to reorder activities (SortableJS)
- 🖼 Optional character image integration
- 🧼 Clean Code, MVC pattern, CodeIgniter 4

---

## 🛠️ Requirements

- PHP >= 7.4
- Composer
- MySQL (optional, no DB used currently)
- Web server (e.g., Apache or use Laragon for simplicity)
- Internet connection to call Groq API

---

## 📦 Installation (Using Laragon or Apache)

1. **Clone or extract the project into your Laragon `www/` directory:**

   ```
   C:\laragon\www\umaximo_ai
   ```

2. **Rename `.env.example` to `.env` and configure your Groq API key:**

   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Install CodeIgniter dependencies (if needed):**

   ```
   composer install
   ```

4. **Run your server (Laragon or Apache) and access via:**

   ```
   http://umaximo_ai.test
   ```

   If using built-in PHP server:

   ```
   php spark serve
   ```

   Then go to:

   ```
   http://localhost:8080
   ```

---

## 🧪 Usage

- Click "Generate Activity" to get a new AI-powered math problem.
- Edit all activities at once using the "Edit Activities" button.
- Reorder them by dragging and dropping during edit mode.
- Receive instant validation feedback when an answer is selected.

---

## 📚 Technologies Used

- PHP 8+ / CodeIgniter 4
- JavaScript (vanilla)
- Bootstrap 4
- SweetAlert2
- SortableJS
- Groq API (via llama-3.3-70b-versatile)

---

## 📄 License

MIT – Free to use and adapt for educational purposes.

---

## ✨ Author

Anthony Escalona Maestre  
[LinkedIn](https://www.linkedin.com/in/anthonyescalonamaestre/)
