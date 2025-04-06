const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
    function speak(text) {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    }

    async function getWeather(city) {
        const apiKey = "4c944257c87d1606277f9c11787aed6b";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("City not found");

            const data = await response.json();
            const temp = data.main.temp;
            const condition = data.weather[0].description;

            const message = `The temperature in ${city} is ${temp} degrees Celsius with ${condition}.`;
            speak(message);
        } catch (error) {
            console.error(error);
            speak(`Sorry, I couldn't find the weather information for ${city}.`);
        }
    }

    function handleCommands(command) {
        let url = "";

        // Weather intent
        const weatherMatch = command.match(/(?:what's the weather in|weather in|temperature in)\s(.+)/i);
        if (weatherMatch && weatherMatch[1]) {
            const city = weatherMatch[1].trim();
            speak(`Getting weather for ${city}`);
            getWeather(city);
            return;
        }

        // Direct commands for specific websites
        const predefinedSites = {
            "youtube": "https://www.youtube.com",
            "facebook": "https://www.facebook.com",
            "google": "https://www.google.com",
            "github": "https://www.github.com",
            "chatgpt": "https://chat.openai.com",
            "whatsapp": "https://www.whatsapp.com",
            "instagram": "https://www.instagram.com",
            "deepseek": "https://deepseek.com"
        };

        // Match "open something"
        const openMatch = command.match(/open\s(.+)/i);
        if (openMatch && openMatch[1]) {
            const siteName = openMatch[1].trim().toLowerCase().replace(/\s/g, '');
            if (predefinedSites[siteName]) {
                speak(`Opening ${siteName}`);
                url = predefinedSites[siteName];
            } else {
                speak(`Opening ${siteName}`);
                url = `https://${siteName}.com`;
            }
        } else {
            speak("I am searching that on Google...");
            url = `https://www.google.com/search?q=${encodeURIComponent(command)}`;
        }

        if (url) {
            setTimeout(() => {
                window.open(url, "_blank");
            }, 1000);
        }
    }

    speak("Hello, how can I help you?");

    setTimeout(() => {
        btn.innerHTML = "Listening...";
        btn.style.backgroundColor = "red";
        recognition.start();
    }, 2000);

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log("User said:", command);
        handleCommands(command);
    };

    recognition.onend = () => {
        btn.innerHTML = "👂 Start Listening...";
        btn.style.backgroundColor = ""; // Reset to default
    };
});
