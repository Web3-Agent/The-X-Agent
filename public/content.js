const createMetaMaskProvider = require("metamask-extension-provider");
// const axios = require('axios');
const Web3 = require('web3');

let provider = createMetaMaskProvider();
let chainIdCont = null;
let accountAddress = provider.selectedAddress;

provider.on("chainChanged", (chainId) => {
    console.log("chainChanged", chainId);
    // onUpdateChainID(parseInt(chainId));
    chainIdCont = parseInt(chainId);  // Update the chainId variable
});
provider.on("disconnect", (error) => {
    console.log("disconnect", error);
    chrome.runtime.sendMessage({ action: "WALLET_DISCONNECTED" });

});
provider.on("connect", (connectInfo) => {
    console.log("connect", connectInfo);
    // onUpdateChainID(parseInt(connectInfo.chainId));
    chrome.runtime.sendMessage({ action: "WALLET_CONNECTED", data: connectInfo });

});
provider.on("accountsChanged", (accounts) => {
    console.log("accountsChanged", accounts);
    // onAccountChange(accounts[0]);

    if (accounts.length > 0) {
        accountAddress = accounts[0];  // Update the accountAddress variable
    } else {
        accountAddress = null;  // No accounts connected
    }
} );



async function connectWallet() {
    // console.log("connect wallet", ethers);
    console.log("provider", provider);
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // const provider = await detectEthereumProvider()
    if (provider) {
        // Prompt user for account connections
        // await checkNetwork();
        await provider.request({ method: 'eth_requestAccounts' });
        const account = provider.selectedAddress;
        console.log(":connectWallet:", account)
        // onAccountChange(account);

         // Send provider data to the background or popup
        chrome.runtime.sendMessage({
            action: "WALLET_CONNECTED",
            provider: provider,
            accountAddress: provider.selectedAddress,
            chainId: "84532"
        });
    } else {
        alert("no provider");
    }
}

// const mintFunc = async () =>
//   {
//     try {
//       const data = {
//         userAddress: "0x20613aBe93e4611Cf547b4395E4248c6129c8697",
//         chainId: '0x14a34',
//         tokenName: `testing name`,
//         tokenSymbol: `testing`,
//         maxSupply: '10000000909090909090909000098098',
//         fundingGoal: '100000000000000000000',
//         amount: '500000000000000',
//       }

//       const response = await axios.post(
//         'https://magicmeme-backend.potp.xyz/memehub/getCreateCalldata',
//         data,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )

//       console.log("response =========>>>>>>>>>",response.data)

//       const callData = response.data.data

//       const web3 = new Web3(provider)



//       const transactionData = {
//         data: callData.calldata,
//         to: callData.to,
//         from: callData.from,
//         value: callData.value,
//         gasLimit: 800000,
//       }

//       console.log('send transaction function ======>>>>>>>', transactionData)

//       const signedTx = await web3.eth.sendTransaction( transactionData )

//       console.log('Transaction successful, hash: ========>>>>>>>>', signedTx.transactionHash)

//       await addMemeDetails(signedTx.transactionHash)

//       return  signedTx

//     } catch (e) {
//       console.log('error =======>>>>>>>>', e)
//     }
// }


const mintFunc = async (memeName, symbol, amountInWei, desc, logoUrl) => {
    console.log("account address from ==============>", provider.selectedAddress);
    console.log("caling mint function properly ===========>>>>>>")
    try {
        const data = {
            // userAddress: `${provider.selectedAddress}`,
            userAddress: "0x6AEEb12fe14b7DAE54277e6bb0042466E2161bF8",
            chainId: '84532', //84532
            tokenName: `${memeName}`,
            tokenSymbol: `${symbol}`,
            maxSupply: '10000000909090909090909000098098',
            fundingGoal: '100000000000000000000',
            amount: `${amountInWei}`,
        };

        const response = await fetch('https://magicmeme-backend.potp.xyz/memehub/getCreateCalldata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("response =========>>>>>>>>>", responseData);

        const callData = responseData.data;
        const web3 = new Web3(provider);

        const transactionData = {
            data: callData.calldata,
            to: callData.to,
            from: callData.from,
            value: callData.value,
            gasLimit: 850000,
        };

        console.log('send transaction function ======>>>>>>>', transactionData);

        const signedTx = await web3.eth.sendTransaction(transactionData);
        console.log('Transaction successful, hash: ========>>>>>>>>', signedTx.transactionHash);

        // let tranhash = `0x7533b6eefc47d4c5b4a96e5b4070779afb8e7ec075b0562db901c36c106bf4cd`;
        await addMemeDetails(signedTx.transactionHash, memeName, symbol, desc, logoUrl);
        return signedTx;

    } catch (e) {
        console.log('error =======>>>>>>>>', e);

    }
};


const addMemeDetails = async (tranHash, memeName, symbol, desc, logoUrl) => {
    try {
        const response = await fetch('https://magicmeme-backend.potp.xyz/memehub/addDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userAddress: provider.selectedAddress,
                chainId: '84532',
                symbol: symbol,
                fullname: memeName,
                description: desc,
                logo: logoUrl,
                transactionHash: tranHash,
            }),
        });

        if (!response.ok) {
            // If the response status is not OK, handle the error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        console.log('Response from addMemeDetails function:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request);

    if (request.action === "mint") {
        const { memeName, symbol, amount, desc, logoUrl } = request;  // Extract memeName and symbol from request object
        console.log("Message received:", memeName, symbol, amount, desc, logoUrl);
        const amountInWei = Web3.utils.toWei(amount, 'ether'); // Convert to wei

        mintFunc(memeName, symbol, amountInWei, desc, logoUrl)  // Pass memeName and symbol to mintFunc
            .then((result) => {
                console.log("Mint function result:", result);
                sendResponse({ status: 'success', data: result });
            })
            .catch((error) => {
                console.error("Mint function error:", error);
                sendResponse({ status: 'error', error: error.message });
            });

        return true; // Keep the message channel open for async response
    }
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'CONNECT_WALLET') {
        connectWallet()
            .then(() => {
                sendResponse({ status: 'success' });
            })
            .catch((error) => {
                sendResponse({ status: 'error', message: error.message });
            });
        return true; // Keep the message channel open for async response
    }
});

// To reset extension's state on new session
const initialColors = [
    "yellow",
    "green",
    "cyan",
    "gray",
    "orange",
    "pink",
    "blue",
    "purple",
    "rose",
    "teal",
];

chrome.storage.local.set({
    highlightedWords: [], availableColors: initialColors,
    chatInputValue: "", chatResponseValue: "", chatWasSubmitted: false,
    summaryInputValue: "", summaryResponseValue: "", summaryWasSubmitted: false
});

const messagesFromReactAppListener = (message, sender, response) => {

    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (sender.id === chrome.runtime.id && message.from === "react" && message.message === 'Get page text') {
        const pageText = document.body.innerText;
        response(pageText);
    }


    if (sender.id === chrome.runtime.id && message.from === "react" && message.message.startsWith("highlight")) {
        let splits = message.message.split(" ");
        const searchTerm = splits[1];
        const className = "highColor" + splits[2].charAt(0).toUpperCase() + splits[2].slice(1);
        const searchTermRegex = new RegExp(searchTerm, 'gi'); // 'g' for global match and 'i' for case insensitive

        // Function to recursively traverse and highlight text nodes
        function highlightTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const matches = node.nodeValue.match(searchTermRegex);
                if (matches) {
                    const span = document.createElement('span');
                    span.innerHTML = node.nodeValue.replace(searchTermRegex, (match) => `<span class=${className}>${match}</span>`);
                    node.parentNode.replaceChild(span, node);
                }
            } else {
                for (let child of node.childNodes) {
                    highlightTextNodes(child);
                }
            }
        }

        highlightTextNodes(document.body);
        response("Done")
    }

    if (sender.id === chrome.runtime.id && message.from === "react" && message.message.startsWith("unhighlight")) {
        let splits = message.message.split(" ");
        const className = "highColor" + splits[1].charAt(0).toUpperCase() + splits[1].slice(1);
        const highlightedElements = document.querySelectorAll(`span.${className}`);

        highlightedElements.forEach(element => {
            const parent = element.parentNode;
            parent.replaceChild(document.createTextNode(element.innerText), element);
            parent.normalize(); // Merge adjacent text nodes
        });

        response("Done")
    }
}
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);










let debounceTimer;
function debouncedDoSomething() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSomething, 3000);
    // debounceTimer = setTimeout(getWarpcastText, 3000);

}
function debouncedWarpcast() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(getWarpcastText, 1000);

}
function debouncedTwitter() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(getTwitterText, 1000);

}

function getEmojiForLabel(label) {
    const emojiMap = {
        // Topics
        "arts_culture": "🎨",
        "business_entrepreneurs": "💼",
        "celebrity_pop_culture": "🌟",
        "diaries_daily_life": "📔",
        "family": "👨‍👩‍👧‍👦",
        "fashion_style": "👗",
        "film_tv_video": "🎬",
        "fitness_health": "💪",
        "food_dining": "🍽️",
        "gaming": "🎮",
        "learning_educational": "📚",
        "music": "🎵",
        "news_social_concern": "📰",
        "other_hobbies": "🎲",
        "relationships": "💞",
        "science_technology": "💻",
        "sports": "🏅",
        "travel_adventure": "✈️",
        "youth_student_life": "🎓",
        // Sentiment
        "positive": "😊",
        "neutral": "😐",
        "negative": "😠",
        // Emotion
        "anger": "😡",
        "anticipation": "🔮",
        "disgust": "🤢",
        "fear": "😨",
        "joy": "😂",
        "love": "❤️",
        "optimism": "👍",
        "pessimism": "👎",
        "sadness": "😢",
        "surprise": "😲",
        "trust": "🤝",
    };

    return emojiMap[label] || "❓"; // Default to question mark if label not found
}

const iconsAbove50 = {
    "llm_generated": "🤖",
    "spam": "🔺",
    "sexual": "🔞",
    "hate": "😡",
    "violence": "⚔️",
    "harassment": "🚷",
    "self_harm": "🆘",
    "sexual_minors": "🚸",
    "hate_threatening": "🚨",
    "violence_graphic": "💥"
};

const iconsBelow50 = {
    "llm_generated": "👾", // Different icon or the same, depending on your preference
    "spam": "▼",
    "sexual": "🙈",
    "hate": "😠",
    "violence": "🛡️",
    "harassment": "🛑",
    "self_harm": "🚑",
    "sexual_minors": "👶",
    "hate_threatening": "⚠️",
    "violence_graphic": "🔨"
};

// Function to get the appropriate icon based on score
function getIcon(category, score) {
    if (score > 0.5) {
        return iconsAbove50[category];
    } else {
        return iconsBelow50[category];
    }
}

function getWarpcastText() {
    try {

        let text = document.getElementsByClassName("flex flex-col whitespace-pre-wrap break-words text-lg leading-6 tracking-normal")[0].innerText

        chrome.runtime.sendMessage({
            action: 'SEND_WARPCAST_TEXT',
            data: text
        });

    } catch (error) {
        console.log("error in getwrapcat ======>>>>>", error)

    }


}

function getTwitterText() {
    const parts = window.location.href.split('/');
    if (parts.length === 6) {
        let text_twitter = document.getElementsByClassName("css-175oi2r r-1s2bzr4")[0]?.innerText;

        chrome.runtime.sendMessage({
            action: 'SEND_WARPCAST_TEXT',
            data: text_twitter
        });
        console.log(text_twitter);
    }
}

function openPopupTwitter() {
    chrome.runtime.sendMessage({ action: "open_popup" });
    debouncedTwitter();

}


function openPoup() {
    chrome.runtime.sendMessage({ action: "open_popup" });
    debouncedWarpcast();

}




function doSomething() {


    const parts = window.location.href.split('/');

    console.log(parts.length);
    console.log(parts);

    if (parts.length === 4 && parts[2] == "x.com") {
        let username = parts[3];
        console.log("username from twitter ======", username);
    
        const div = document.querySelector('div[data-testid="UserName"]');
    
        // Create the new button element
        const button = document.createElement('button');
        button.textContent = 'Swap';
    
        // Add styles directly to the button
        button.style.backgroundColor = '#e7e8e9';  // light gray background
        button.style.border = 'none';
        button.style.borderRadius = '50px';        // rounded edges
        button.style.padding = '10px 20px';        // space inside the button
        button.style.color = 'black';              // text color
        button.style.fontSize = '16px';            // text size
        button.style.cursor = 'pointer';           // shows pointer on hover
        button.style.fontFamily = 'Arial, sans-serif'; // font style
        button.style.fontWeight = 'bold';          // bold text
        button.style.width = '90px';              // set button width
        button.style.marginBottom = '10px';            // set margin (10px top and bottom)
    
        // Add hover effect (using JavaScript)
        button.addEventListener('mouseenter', function () {
            button.style.backgroundColor = '#d6d7d8'; // darker gray on hover
        });
        button.addEventListener('mouseleave', function () {
            button.style.backgroundColor = '#e7e8e9'; // return to original color
        });
    
        // Insert the button after the div
        // div.insertAdjacentElement('afterend', button);
        div.appendChild(button);
    }
    

    if (parts.length === 6) {
        let text_twitter = document.getElementsByClassName("css-175oi2r r-1s2bzr4")[0]?.innerText
        console.log('twitter text : ', text_twitter);


        let globalData1 = null;
        let loadingInterval = null;

        if (!document.getElementById("uniqueId0")) {
            const outerDivx = document.createElement('div');
            outerDivx.id = 'uniqueId0';
            outerDivx.className = 'css-175oi2r r-1kbdv8c r-18u37iz r-1oszu61 r-3qxfft r-n7gxbd r-2sztyj r-1efd50x r-5kkj8d r-h3s6tt r-1wtj0ep';

            const svgIcon = `<svg width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="20" stroke="#061F30" stroke-width="5" fill="none"/>
                <circle cx="25" cy="25" r="20" stroke="#1D97EB" stroke-width="5" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round">
                  <animateTransform attributeName="transform" type="rotate" values="0 25 25;360 25 25" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
              `;

            // Create a span for the loading text
            const loadingText = document.createElement('span');
            loadingText.textContent = 'Loading';
            loadingText.style.marginLeft = '10px'; // Add some space between the SVG and the text

            outerDivx.innerHTML = svgIcon;
            outerDivx.appendChild(loadingText);


            const targetElement = document.querySelector('.css-175oi2r.r-18u37iz.r-1udh08x.r-1c4vpko.r-1c7gwzm.r-1ny4l3l');


            // Insert outerDivx after the target element
            if (targetElement) {
                targetElement.insertAdjacentElement('afterend', outerDivx);
            }


            let dotCount = 0;
            loadingInterval = setInterval(() => {
                dotCount = (dotCount % 3) + 1;
                loadingText.textContent = `Loading${'.'.repeat(dotCount)}`;
            }, 500);

        }


    //     const newDiv = document.createElement('div');
    //     newDiv.id = "uniqueId6";
    //     const svgIcon = `<svg width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    //     <circle cx="25" cy="25" r="20" stroke="#061F30" stroke-width="5" fill="none"/>
    //     <circle cx="25" cy="25" r="20" stroke="#1D97EB" stroke-width="5" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round">
    //       <animateTransform attributeName="transform" type="rotate" values="0 25 25;360 25 25" dur="1s" repeatCount="indefinite"/>
    //     </circle>
    //   </svg>`;

    //     newDiv.innerHTML = '<div class="flex flex-col"><h3>Sentiplex Summary</h3><p>' + svgIcon + '</p></div>';

    //     // Select the target element
    //     const targetElement = document.querySelector('.css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x');

    //     // Insert newDiv before targetElement
    //     targetElement.parentNode.insertBefore(newDiv, targetElement);


        // URLs for the APIs
        const url_1 = 'https://content-analysis.onrender.com/api/label-text';
        const url_2 = 'https://content-analysis.onrender.com/vision/gpt-4o';
        const url_3 = 'https://content-analysis.onrender.com/vision/mixtral-8x7b';
        const url_4 = 'https://content-analysis.onrender.com/vision/llama-3';
        const url_5 = 'https://content-analysis.onrender.com/onchain/send-message';
        const url_6 = 'https://content-analysis.onrender.com/vision/gpt-4o';

        // Data for the POST requests
        const data_1 = JSON.stringify({ text_inputs: [text_twitter] });
        const sumarize = "Give me a brief and crisp summary of this text: " + "'" + text_twitter + "'"
        text_twitter = "Give me an estimate of authenticity of this post. Don't give any explanations, just a number from 1 to 100: " + "'" + text_twitter + "'"
        console.log('text', text_twitter);
        const data_2 = JSON.stringify({ content: text_twitter });
        const data_3 = JSON.stringify({ content: text_twitter });
        const data_4 = JSON.stringify({ content: text_twitter });
        const data_5 = JSON.stringify({ message: text_twitter });
        const data_6 = JSON.stringify({ content: sumarize });

        // Fetch requests
        const fetch_1 = fetch(url_1, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_1 });
        const fetch_2 = fetch(url_2, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_2 });
        const fetch_3 = fetch(url_3, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_3 });
        const fetch_4 = fetch(url_4, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_4 });
        const fetch_5 = fetch(url_5, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_5 });
        const fetch_6 = fetch(url_6, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data_6 });


        Promise.all([fetch_1, fetch_2, fetch_3, fetch_4, fetch_5, fetch_6])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([data_1, data_2, data_3, data_4, data_5, data_6]) => {
                clearInterval(loadingInterval);
                document.getElementById('uniqueId0').remove();
                // document.getElementById('uniqueId6').remove();

                console.log('twitter_Data from API 1:', data_1);
                console.log('Data from API 2:', data_2.content);
                console.log('Data from API 3:', data_3.content);
                console.log('Data from API 4:', data_4.content);
                console.log('Data from API 5:', data_5.response);
                console.log('Data from API 6:', data_6.content);

                // Step 1: Create an array with all values
                const values1 = [data_2.content, data_3.content, data_4.content, data_5.response]
                    .map(Number) // Convert all values to numbers
                    .filter(val => !isNaN(val) && val <= 100); // Filter out NaN values and values greater than 100

                // Step 3: Calculate the average of the remaining values
                const average1 = values1.length > 0 ? values1.reduce((acc, val) => acc + val, 0) / values1.length : 0;
                console.log('Average of twitter_post:', average1);


                // Check if the element already exists
                // Check if uniqueId0 already exists
                // if (!document.getElementById("uniqueId0")) {

                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId0';
                //     outerDivx.className = 'css-175oi2r r-1kbdv8c r-18u37iz r-1oszu61 r-3qxfft r-n7gxbd r-2sztyj r-1efd50x r-5kkj8d r-h3s6tt r-1wtj0ep';

                //     const innerDiv = document.createElement('div');
                //     innerDiv.id = 'firstIcon';
                //     innerDiv.style.paddingTop = "10px";
                //     // Determine fill color based on average1 value
                //     const fillColor = average1 > 70 ? '#4CAF50' : average1 < 40 ? '#F44336' : '#FFEB3B';

                //     // SVG icon with dynamic fill color
                //     innerDiv.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                //                   <circle cx="12" cy="12" r="10" fill="${fillColor}"/>
                //                </svg>`;

                //     // Set tooltip title with data contents
                //     innerDiv.title = `GPT-4o: ${data_2.content}%\nMixtral-8x7b: ${data_3.content}%\nLlama-3: ${data_4.content}%\nClaude 3.5 Sonnet: ${data_5.response}%`;

                //     outerDivx.appendChild(innerDiv);
                //     // Select the target element
                //     const targetElement = document.querySelector('.css-175oi2r.r-18u37iz.r-1udh08x.r-1c4vpko.r-1c7gwzm.r-1ny4l3l');


                //     // Insert outerDivx after the target element
                //     if (targetElement) {
                //         targetElement.insertAdjacentElement('afterend', outerDivx);
                //     }
                // }


                globalData1 = data_1;


                // if (!document.getElementById("uniqueId1")) {
                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId1';

                //     const svgIcon = getEmojiForLabel(globalData1.topics.label);

                //     outerDivx.innerHTML = svgIcon;
                //     outerDivx.title = globalData1.topics.label + ' ' + Math.round(globalData1.topics.score * 100) + '%';

                //     const targetElement = document.querySelector('#uniqueId0');
                //     targetElement.appendChild(outerDivx);


                // }

                // if (!document.getElementById("uniqueId2")) {

                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId2';

                //     const svgIcon = getEmojiForLabel(globalData1.sentiment.label);

                //     outerDivx.innerHTML = svgIcon;
                //     outerDivx.title = globalData1.sentiment.label + ' ' + Math.round(globalData1.sentiment.score * 100) + '%';

                //     const targetElement = document.querySelector('#uniqueId0');
                //     targetElement.appendChild(outerDivx);


                // }


                // if (!document.getElementById("uniqueId3")) {

                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId3';

                //     const svgIcon = getEmojiForLabel(globalData1.moderation.label);

                //     outerDivx.innerHTML = svgIcon;
                //     outerDivx.title = globalData1.moderation.label + ' ' + Math.round(globalData1.moderation.score * 100) + '%';

                //     const targetElement = document.querySelector('#uniqueId0');
                //     targetElement.appendChild(outerDivx);

                // }


                // if (!document.getElementById("uniqueId4")) {

                //     const outerDivx = document.createElement('div');
                //     outerDivx.id = 'uniqueId4';


                //     const svgIcon = getEmojiForLabel(globalData1.emotion.label);

                //     outerDivx.innerHTML = svgIcon;
                //     outerDivx.title = globalData1.emotion.label + ' ' + Math.round(globalData1.emotion.score * 100) + '%';

                //     const targetElement = document.querySelector('#uniqueId0');
                //     targetElement.appendChild(outerDivx);


                // }




                if (!document.getElementById("uniqueButton")) {

                    const outerDivx = document.createElement('div');
                    outerDivx.id = 'uniqueButton';
                    outerDivx.style.paddingTop = "10px";
                    // Create the button element
                    const button = document.createElement('button');
                    button.innerHTML = "CreateAiAgent";  // Set button text
                    button.id = "btn_unique";

                    // Add inline style to match the button in the image
                    button.style.backgroundColor = '#f2f2f2';  // Light background
                    button.style.color = '#000';  // Black text
                    button.style.border = '1px solid #d1d1d1';  // Light gray border
                    button.style.padding = '8px 16px';  // Padding
                    button.style.borderRadius = '20px';  // Rounded corners
                    button.style.fontSize = '14px';  // Font size
                    button.style.fontFamily = 'Arial, sans-serif';  // Font family
                    button.style.cursor = 'pointer';  // Cursor change on hover
                    button.style.outline = 'none';  // Remove outline on focus
                    button.style.fontWeight = 'bold';
                    button.style.marginLeft = '10px';
                    // Add event listeners for hover and active states
                    button.onmouseover = function () {
                        button.style.backgroundColor = '#e0e0e0';  // Slightly darker on hover
                    };

                    button.onmouseout = function () {
                        button.style.backgroundColor = '#f2f2f2';  // Revert to original color
                    };

                    button.onmousedown = function () {
                        button.style.backgroundColor = '#d1d1d1';  // Darker when clicked
                    };

                    button.onmouseup = function () {
                        button.style.backgroundColor = '#e0e0e0';  // Go back to hover state
                    };

                    button.onclick = function () {
                        openPopupTwitter();
                    };

                    // Add the button to the div
                    outerDivx.appendChild(button);

                    // const targetElement = document.querySelector('#uniqueId0');
                    // targetElement.appendChild(outerDivx);

                    const targetElement = document.querySelector('.css-175oi2r.r-18u37iz.r-1udh08x.r-1c4vpko.r-1c7gwzm.r-1ny4l3l');


                    // Insert outerDivx after the target element
                    if (targetElement) {
                        targetElement.insertAdjacentElement('afterend', outerDivx);
                    }
                }


                const memecoinTokens = [
                    "$DOGE",    // Dogecoin
                    "$SHIB",    // Shiba Inu
                    "$PEPE",    // PepeCoin
                    "$FLOKI",   // Floki Inu
                    "$BabyDoge",// Baby Doge Coin
                    "$LEASH",   // Doge Killer
                    "$AKITA",   // Akita Inu
                    "$KISHU",   // Kishu Inu
                    "$HOGE",    // Hoge Finance
                    "$DOBO",    // DogeBonk
                    "$POPCAT"   // Popcat
                  ];
                  
        
                // Check if any memecoin token exists in the tweet text
                const tokenExists = memecoinTokens.some(token => text_twitter.includes(token));
        
                if (!tokenExists) {
                    const messageDiv = document.createElement('div');
                    messageDiv.innerText = 'No memecoin token exists in the tweet';
                    messageDiv.style.color = 'red'; // Optional: style the message
                    messageDiv.style.marginTop = '10px'; // Optional: add some margin
                    messageDiv.style.fontSize = '14px'; // Optional: adjust font size
                    messageDiv.style.marginLeft = '10px';
                    const targetElement = document.querySelector('#uniqueButton');
                    if (targetElement) {
                        targetElement.insertAdjacentElement('afterend', messageDiv);
                    }
                    return; // Exit the function if no token exists
                }

                if (tokenExists) {

                if (!document.getElementById("uniqueId0")) {
                    const outerDivx = document.createElement('div');
                    outerDivx.id = 'uniqueId0';
                    outerDivx.className = 'ui-container'; // Added class for styling
                
                    const innerDiv = document.createElement('div');
                    innerDiv.id = 'firstIcon';
                    innerDiv.style.paddingTop = "10px";
                
                    // Updated inner HTML to match the design structure in the image
                    innerDiv.innerHTML = `
                        <div style="background-color: #000000; border:2px solid #2F3336; color: white; padding: 20px; margin: 10px; border-radius: 15px; display: flex; flex-direction: row; align-items: center; gap: 15px;">
                            <!-- Rounded div to replace the image -->
                            <!-- Text content -->
                            <div style="flex-grow: 1;">
                            <div style="display: flex; flex-direction: row; gap:6px; align-items: center; margin-bottom:4px;">
                            <div style="background-color: #FF9900; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 14px; color: white; font-weight: bold;">W</span>
                            </div>
                            <div style="font-size: 14px; color: #bbb;">WBTC <span style="color: #3b82f6; cursor: pointer;">3NZ9...cqmJh</span></div>
                            </div>
                                <div style="font-size: 22px; font-weight: bold;">$305.2M MC <span style="font-size: 12px; color: #bbb; cursor: pointer;">&#x21bb;</span></div>
                                <div style="font-size: 14px; color: #4caf50;">+5.44% today</div>
                                <div style="font-size: 14px; color: #bbb;">$101.67K price</div>
                            </div>
                            <!-- Buy and Sell buttons -->
                            <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
                                <button style="background-color: #4caf50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Buy</button>
                                <button style="background-color: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">Sell</button>
                            </div>
                        </div>`;
                
                    outerDivx.appendChild(innerDiv);
                    const targetElement = document.querySelector('#uniqueButton');
                
                    // Insert outerDivx after the target element
                    if (targetElement) {
                        targetElement.insertAdjacentElement('afterend', outerDivx);
                    }
                    targetElement.insertAdjacentHTML('afterend', '<br>');
                }
        
            }






                // const newDiv = document.createElement('div');
                // newDiv.id = "uniqueId6";
                // newDiv.innerHTML = '<div class="flex flex-col"><h3>Sentiplex Summary</h3><p>' + data_6.content + '</p></div>';

                // // Select the target element
                // const targetElement = document.querySelector('.css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x');

                // // Insert newDiv before targetElement
                // targetElement.parentNode.insertBefore(newDiv, targetElement);



            })
            .catch(error => {
                console.error('Error:', error);
            });







    }






    // if (parts.length === 5) {
    //     let text = document.getElementsByClassName("flex flex-col whitespace-pre-wrap break-words text-lg leading-6 tracking-normal")[0].innerText
    //     console.log('text =========>>>>>>>>', text);
    //     // flex flex-col whitespace-pre-wrap break-words text-lg leading-6 tracking-normal

    //     let globalData = null;
    //     let loadingInterval = null;

    //     if (!document.getElementById("uniqueElementId0")) {
    //         const outerDiv = document.createElement('div');
    //         outerDiv.id = "uniqueElementId0"; // Set a unique ID for the outer div
    //         outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //         // group flex w-9 flex-row items-center text-sm text-faint cursor-pointer

    //         const innerDiv = document.createElement('div');
    //         innerDiv.className = "group flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //         // const svgIcon = `<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><filter id="spinner-gF01"><feGaussianBlur in="SourceGraphic" stdDeviation="1" result="y"/><feColorMatrix in="y" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="z"/><feBlend in="SourceGraphic" in2="z"/></filter></defs><g filter="url(#spinner-gF01)"><circle fill="#1F51FF" cx="5" cy="12" r="4"><animate attributeName="cx" calcMode="spline" dur="2s" values="5;8;5" keySplines=".36,.62,.43,.99;.79,0,.58,.57" repeatCount="indefinite"/></circle><circle fill="#1F51FF" cx="19" cy="12" r="4"><animate attributeName="cx" calcMode="spline" dur="2s" values="19;16;19" keySplines=".36,.62,.43,.99;.79,0,.58,.57" repeatCount="indefinite"/></circle><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>`;

    //         const svgIcon = `<svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#999999">
    //         <!-- Background circle with white stroke -->
    //         <circle cx="50" cy="50" r="45" stroke="#ffffff" stroke-width="5" fill="none" />
            
    //         <!-- Foreground animated circle -->
    //         <circle cx="50" cy="50" r="45" stroke="#999999" stroke-width="5" fill="none" stroke-dasharray="283" stroke-dashoffset="75">
    //           <animateTransform
    //             attributeName="transform"
    //             type="rotate"
    //             values="0 50 50;360 50 50"
    //             dur="1s"
    //             repeatCount="indefinite" />
    //         </circle>
    //       </svg>`;
    //         // Create a span for the loading text
    //         const loadingText = document.createElement('span');
    //         loadingText.textContent = 'Loading';
    //         loadingText.style.marginLeft = '10px'; // Add some space between the SVG and the text

    //         innerDiv.innerHTML = svgIcon;
    //         innerDiv.appendChild(loadingText);
    //         outerDiv.appendChild(innerDiv);

    //         const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //         targetElement.appendChild(outerDiv);


    //         let dotCount = 0;
    //         loadingInterval = setInterval(() => {
    //             dotCount = (dotCount % 3) + 1;
    //             loadingText.textContent = `Loading${'.'.repeat(dotCount)}`;
    //         }, 500);

    //     }

    //     const newDiv = document.createElement('div');
    //     newDiv.id = "uniqueElementId6";
    //     const svgIcon = `<svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#999999">
    //     <!-- Background circle with white stroke -->
    //     <circle cx="50" cy="50" r="45" stroke="#F6F6F6" stroke-width="5" fill="none" />
        
    //     <!-- Foreground animated circle -->
    //     <circle cx="50" cy="50" r="45" stroke="#999999" stroke-width="5" fill="none" stroke-dasharray="283" stroke-dashoffset="75">
    //       <animateTransform
    //         attributeName="transform"
    //         type="rotate"
    //         values="0 50 50;360 50 50"
    //         dur="1s"
    //         repeatCount="indefinite" />
    //     </circle>
    //   </svg>`;

    //     newDiv.innerHTML = '<div class="mt-3 hidden rounded-lg px-2 py-3 pt-1.5 bg-overlay-light mdlg:block"><div class="px-2 py-1 text-lg font-semibold">The X Agent Summary</div><div class="flex justify-center items-center px-2 py-4 text-sm text-muted">' + svgIcon + '</div><div class="flex flex-col items-center pt-1"><button id="copyButton" class="rounded-lg font-semibold border bg-action-tertiary border-action-tertiary hover:bg-action-tertiary-hover hover:border-action-tertiary-hover active:border-action-tertiary-active disabled:border-action-tertiary disabled:text-action-tertiary-disabled disabled:hover:bg-action-tertiary disabled:active:border-action-tertiary px-4 py-2 text-sm w-full" disabled>Copy to clipboard</button></div></div>';
    //     newDiv.title = 'Summary: Loading...';

    //     const parentElement = document.querySelector('.sticky.top-0.hidden.h-full.flex-shrink-0.flex-grow.flex-col.sm\\:flex.sm\\:max-w-\\[330px\\].pt-3');
    //     parentElement.insertBefore(newDiv, parentElement.children[1]);

    //     // URLs for the APIs
    //     const url1 = 'https://content-analysis.onrender.com/api/label-text';
    //     const url2 = 'https://content-analysis.onrender.com/vision/gpt-4o';
    //     const url3 = 'https://content-analysis.onrender.com/vision/mixtral-8x7b';
    //     const url4 = 'https://content-analysis.onrender.com/vision/llama-3';
    //     const url5 = 'https://content-analysis.onrender.com/onchain/send-message';
    //     const url6 = 'https://content-analysis.onrender.com/vision/gpt-4o';

    //     // Data for the POST requests
    //     const data1 = JSON.stringify({ text_inputs: [text] });
    //     const sumarize = "Give me a brief and crisp summary of this text: " + "'" + text + "'"
    //     text = "Give me an estimate of authenticity of this post. Don't give any explanations, just a number from 1 to 100: " + "'" + text + "'"
    //     console.log('text', text);
    //     const data2 = JSON.stringify({ content: text });
    //     const data3 = JSON.stringify({ content: text });
    //     const data4 = JSON.stringify({ content: text });
    //     const data5 = JSON.stringify({ message: text });
    //     const data6 = JSON.stringify({ content: sumarize });

    //     // Fetch requests
    //     const fetch1 = fetch(url1, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data1 });
    //     const fetch2 = fetch(url2, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data2 });
    //     const fetch3 = fetch(url3, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data3 });
    //     const fetch4 = fetch(url4, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data4 });
    //     const fetch5 = fetch(url5, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data5 });
    //     const fetch6 = fetch(url6, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data6 });

    //     // Use Promise.all to wait for both fetch requests to complete
    //     Promise.all([fetch1, fetch2, fetch3, fetch4, fetch5, fetch6])
    //         .then(responses => Promise.all(responses.map(res => res.json())))
    //         .then(([data1, data2, data3, data4, data5, data6]) => {
    //             clearInterval(loadingInterval);
    //             document.getElementById('uniqueElementId0').remove();

    //             console.log('Data from API 1:', data1);
    //             console.log('Data from API 2:', data2.content);
    //             console.log('Data from API 3:', data3.content);
    //             console.log('Data from API 4:', data4.content);
    //             console.log('Data from API 5:', data5.response);
    //             console.log('Data from API 6:', data6.content);

    //             // Step 1: Create an array with all values
    //             const values = [data2.content, data3.content, data4.content, data5.response]
    //                 .map(Number) // Convert all values to numbers
    //                 .filter(val => !isNaN(val) && val <= 100); // Filter out NaN values and values greater than 100

    //             // Step 3: Calculate the average of the remaining values
    //             const average = values.length > 0 ? values.reduce((acc, val) => acc + val, 0) / values.length : 0;
    //             console.log('Average:', average);

    //             // Check if the element already exists
    //             if (!document.getElementById("uniqueElementId0")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId0"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 let fillColor;

    //                 if (average > 70) {
    //                     fillColor = "#4CAF50"; // Green
    //                 } else if (average < 40) {
    //                     fillColor = "#F44336"; // Red
    //                 } else {
    //                     fillColor = "#FFEB3B"; // Yellow
    //                 }

    //                 const svgIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="${fillColor}"/></svg>`;

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = 'GPT-4o: ' + data2.content + '%\n' + 'Mixtral-8x7b: ' + data3.content + '%\n' + 'Llama-3: ' + data4.content + '%\n' + 'Claude 3.5 Sonnet: ' + data5.response + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             globalData = data1;

    //             if (!document.getElementById("uniqueElementId1")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId1"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 const svgIcon = getEmojiForLabel(globalData.topics.label);

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = globalData.topics.label + ' ' + Math.round(globalData.topics.score * 100) + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             if (!document.getElementById("uniqueElementId2")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId2"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group text-xl flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 const svgIcon = getEmojiForLabel(globalData.sentiment.label);

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = globalData.sentiment.label + ' ' + Math.round(globalData.sentiment.score * 100) + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             if (!document.getElementById("uniqueElementId3")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId3"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 const svgIcon = getEmojiForLabel(globalData.emotion.label);

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = globalData.emotion.label + ' ' + Math.round(globalData.emotion.score * 100) + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             if (!document.getElementById("uniqueElementId4")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId4"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 group-hover:bg-gray-200 dark:hover:bg-overlay-medium dark:group-hover:bg-overlay-medium text-action-purple text-faint";

    //                 //const svgIcon = getEmojiForLabel(globalData.moderation.label);
    //                 const svgIcon = getIcon(globalData.moderation.label, globalData.moderation.score);

    //                 innerDiv.innerHTML = svgIcon;
    //                 innerDiv.title = globalData.moderation.label + ' ' + Math.round(globalData.moderation.score * 100) + '%';
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //             }

    //             if (!document.getElementById("uniqueElementId5")) {
    //                 const outerDiv = document.createElement('div');
    //                 outerDiv.id = "uniqueElementId5"; // Set a unique ID for the outer div
    //                 outerDiv.className = "group flex w-9 flex-row items-center text-sm text-faint cursor-pointer";

    //                 const innerDiv = document.createElement('div');
    //                 innerDiv.className = "group text-xl flex flex-row items-center justify-center rounded-full pt-2 transition-colors text-action-purple text-faint";

    //                 // Create the button element
    //                 const button = document.createElement('button');
    //                 button.textContent = "Create Meme";  // Set button text as "Cast"

    //                 // Add inline styles for the button
    //                 button.style.backgroundColor = "#7e57c2"; // Purple background
    //                 button.style.color = "white";             // White text
    //                 button.style.padding = "6px 6px";        // Padding
    //                 button.style.fontSize = "11px";           // Font size
    //                 button.style.border = "none";             // Remove border
    //                 button.style.borderRadius = "8px";        // Rounded corners
    //                 button.style.cursor = "pointer";
    //                 button.style.width = "120px"; // Pointer cursor on hover

    //                 // Add hover effect by using mouse events
    //                 button.onmouseover = function () {
    //                     button.style.backgroundColor = "#6c4bab";  // Darker purple on hover
    //                 };
    //                 button.onmouseout = function () {
    //                     button.style.backgroundColor = "#7e57c2";  // Original color when not hovering
    //                 };

    //                 // Add click event to show an alert
    //                 button.onclick = function () {
    //                     // alert( "Button was clicked!" );

    //                     openPoup();

    //                     // if (provider) {
    //                     //      openPoup();
    //                     // } else {
    //                     //      connectWallet();
    //                     // }

    //                 };

    //                 innerDiv.appendChild(button);
    //                 outerDiv.appendChild(innerDiv);

    //                 const targetElement = document.querySelector('.flex.flex-row.items-center.gap-3');
    //                 targetElement.appendChild(outerDiv);
    //                 // const targetElement = document.querySelector('.flex.flex-col.whitespace-pre-wrap.break-words.text-lg.leading-6.tracking-normal');
    //                 // targetElement.insertAdjacentElement('afterend', outerDiv);

    //             }



    //             const parentElement = document.getElementById('uniqueElementId6');
    //             // Modify the button element to include an ID for easy selection
    //             parentElement.innerHTML = '<div class="mt-3 hidden rounded-lg px-2 py-3 pt-1.5 bg-overlay-light mdlg:block"><div class="px-2 py-1 text-lg font-semibold">The X Agent Summary</div><div class="px-2 py-1 text-sm text-muted">' + data6.content + '</div><div class="flex flex-col items-center pt-1"><button id="copyToClipboardButton" class="rounded-lg font-semibold border bg-action-tertiary border-action-tertiary hover:bg-action-tertiary-hover hover:border-action-tertiary-hover active:border-action-tertiary-active disabled:border-action-tertiary disabled:text-action-tertiary-disabled disabled:hover:bg-action-tertiary disabled:active:border-action-tertiary px-4 py-2 text-sm w-full">Copy to clipboard</button></div></div>';

    //             // Ensure the DOM has been updated before trying to attach the event listener
    //             document.getElementById('copyToClipboardButton').addEventListener('click', function () {
    //                 // Use the Clipboard API to copy text
    //                 navigator.clipboard.writeText(data6.content).then(function () {
    //                     console.log('Content copied to clipboard successfully!');
    //                 }).catch(function (error) {
    //                     console.error('Error copying text: ', error);
    //                 });
    //             });

    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // }
}

function handleNewContent() {
    // Disconnect and reconnect observer to avoid infinite loops
    observer.disconnect();
    debouncedDoSomething();
    //observeDOMChanges();
}

function observeDOMChanges() {
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", debouncedDoSomething);
} else {
    debouncedDoSomething();
}

// Observe changes in the DOM
const observer = new MutationObserver(handleNewContent);
observeDOMChanges();

// Call listenCasts to initialize the listeners
//debouncedDoSomething();

// Testing metamask


