// Main application state
let currentChapter = 0;
let chapterData = {};
// Example: let bookmarks = JSON.parse(localStorage.getItem('networkBookmarks') || '{}');


// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load chapter metadata
        await loadChapterMetadata();

        // Set up event listeners (assuming some are for theme, keyboard, etc. not shown in full)
        // setupEventListeners();

        // Initialize theme (assuming function exists)
        // initializeTheme();

        // Generate progress dots dynamically based on chapterData size
        generateProgressDots();

        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        // Example: showNotification('应用初始化失败，请刷新页面重试', 'error');
    }
}

async function loadChapterMetadata() {
    // This would typically load from a metadata file or API
    // For now, we'll define it inline
    chapterData = {
        1: {
            title: '网络世界初探',
            file: 'chapters/chapter1.md',
            readingTime: '15 分钟',
            tags: ['OSI模型', 'TCP/IP', '网络分类']
        },
        2: {
            title: '神奇的物理连接',
            file: 'chapters/chapter2.md',
            readingTime: '12 分钟',
            tags: ['物理层', '传输介质', '信号传输']
        },
        3: {
            title: '局域网的秘密',
            file: 'chapters/chapter3.md',
            readingTime: '16 分钟',
            tags: ['数据链路层', 'MAC地址', '交换机', '以太网', 'WiFi']
        },
        4: {
            title: '数据包的奇幻漂流',
            file: 'chapters/chapter4.md',
            readingTime: '20 分钟',
            tags: ['网络层', 'IP地址', '路由', '路由器', 'ARP', 'ICMP', 'NAT']
        },
        5: {
             title: '可靠与高效的传输艺术',
             file: 'chapters/chapter5.md',
             readingTime: '25 分钟',
             tags: ['传输层', 'TCP', 'UDP', '端口号', '三次握手', '四次挥手', '流量控制', '拥塞控制']
        },
        6: {
             title: '应用层协议嘉年华',
             file: 'chapters/chapter6.md',
             readingTime: '30 分钟',
             tags: ['应用层', 'HTTP', 'HTTPS', 'DNS', 'FTP', 'SMTP', 'POP3', 'IMAP']
        },
        7: {
             title: '网络安全小课堂',
             file: 'chapters/chapter7.md',
             readingTime: '18 分钟',
             tags: ['网络安全', '威胁', '防御', '防火墙', '加密']
        },
        8: {
             title: '动手练练基本功',
             file: 'chapters/chapter8.md',
             readingTime: '20 分钟', 
             tags: ['网络诊断', '命令行工具', 'Wireshark', '实践'] 
        },
         9: { 
            title: '重点知识梳理与考点冲刺',
            file: 'chapters/chapter9.md',
            readingTime: '40 分钟', 
            tags: ['复习', '考点', '总结', '期末冲刺'] 
        }
    };
}

// Placeholder for omitted event listeners and theme initialization logic
// function setupEventListeners() { /* ... */ }
// function handleKeyboardNavigation(e) { /* ... */ }
// function initializeTheme() { /* ... */ }
// function updateScrollProgress() { /* ... */ }


async function loadChapter(chapterNumber) {
    try {
        // Example: showLoading();

        const chapterInfo = chapterData[chapterNumber];
        if (!chapterInfo) {
            throw new Error(`Chapter ${chapterNumber} not found`);
        }

        // Fetch the markdown file
        const response = await fetch(chapterInfo.file);
        if (!response.ok) {
            throw new Error(`Failed to load chapter ${chapterInfo.file}: ${response.statusText}`);
        }

        const markdownText = await response.text();

        // Parse YAML front matter and markdown content
        const { metadata, content } = parseMarkdownWithFrontMatter(markdownText);

        // Convert markdown to HTML
        const htmlContent = marked.parse(content);

        // Process the HTML to add custom styling
        const processedContent = processChapterContent(htmlContent);

        // Display the chapter
        displayChapter(chapterNumber, processedContent, metadata);

        // Update navigation state
        currentChapter = chapterNumber;
        updateProgress(); // Update progress indicator when chapter loads

        // Example: hideLoading();

    } catch (error) {
        console.error('Error loading chapter:', error);
        // Example:
        // if (error.message.includes(chapterData[chapterNumber]?.file) && error.message.includes('Failed to load')) {
        //      showNotification(`章节加载失败：文件 ${chapterData[chapterNumber].file} 未找到或无法访问。`, 'error');
        // } else {
        //     showNotification('章节加载失败，请重试', 'error');
        // }
        // hideLoading();
    }
}

function parseMarkdownWithFrontMatter(text) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = text.match(frontmatterRegex);

    if (match) {
        try {
            const metadata = jsyaml.load(match[1]);
            const content = match[2];
            return { metadata, content };
        } catch (error) {
            console.warn('Failed to parse YAML front matter:', error);
            return { metadata: {}, content: text }; // Return full text as content if YAML fails
        }
    } else {
        // No front matter found, treat the whole text as content
        return { metadata: {}, content: text };
    }
}

function processChapterContent(html) {
    // Add custom classes and styling to the HTML content
    let processed = html;

    // Add diagram placeholders
    processed = processed.replace(/\[此处插入图表：([^\]]+)\]/g, (match, description) => {
        const icons = {
            '网络拓扑': '🌐', 'OSI': '📊', '模型': '📋', '信号': '📡', '传输': '🔄',
            '结构': '🏗️', '工作原理': '⚙️', 'MAC地址': '🆔', '帧': '📦',
            '交换机': '🔄', 'CSMA/CD': '🚦', 'Wi-Fi': '📶', '关系': '🔗',
            'IP地址': '📍', 'IPv4地址': '📍', 'IPv6地址': '📍', '路由': '🗺️',
            'NAT': '🚪', 'ARP': '🤝', 'ICMP': '🩺', 'Ping': '💬', 
            'TCP': '📦', 'UDP': '✉️', '端口': '🚪', '握手': '🤝', '挥手': '👋',
            '滑动窗口': '🖼️', '拥塞控制': '🚗', '复用与分用': '🔱', '报文格式': '📝',
            'HTTP请求': '📩', 'HTTP响应': '📤', 'HTTP方法': '⚙️', 'HTTP状态码': '🚦', 'HTTPS': '🔒',
            'SSL/TLS': '🔑', '数字证书': '📜', 'DNS解析': '🔍', 'DNS查询': '❓',
            'DNS服务器': '🏛️', 'FTP': '📂', '文件传输': '🚚', '邮件发送': '📬',
            '邮件收取': '📥', '邮件流程': '➡️', '网络安全': '🛡️', '威胁': '👾', 
            '病毒': '🦠', '木马': '🐎', '钓鱼': '🎣', 'DDoS': '🌪️', '防御': '⚔️', 
            '防火墙': '🔥', '加密': '🔑', '证书': '📜', '安全习惯': '✅', 
            '诊断': '🩺', '工具': '🔧', '命令行': '💻', 'Wireshark': '🔬', 
            '抓包': '🕵️‍♀️', '截图': '📸', '示例': '📋', '解读': '🧠',
            '流程': '➡️', '界面': '🖥️', '筛选器': '🔎', 'Traceroute': '🗺️', 
            'logo': '⭐', '主界面': '🖥️',
            '复习': '📚', '考点': '🎯', '总结': '📝', '冲刺': '🏃‍♀️', '重点': '✨', '体系': '🏗️',
            '高频': '🔥', '易错点': '❌', '建议': '💡', '技巧': '🔑', '框架': '📍', '原理': '🧠',
            '比喻': '😂', '画图': '🎨', '实践': '🛠️', '回顾': '🔄', '检验': '✅',
            '表格': '📄', '思维导图': '🧠'
        };

        let icon = '📊'; // default icon
        for (const [key, value] of Object.entries(icons)) {
            if (description.toLowerCase().includes(key.toLowerCase())) {
                icon = value;
                break;
            }
        }
        const displayIcon = typeof icon === 'string' ? icon : '📊';


        return `
            <div class="my-6 p-6 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg shadow-md">
                <div class="flex items-center">
                    <span class="text-3xl mr-4">${displayIcon}</span>
                    <div>
                        <h4 class="text-lg font-semibold text-indigo-700">图表示意</h4>
                        <p class="text-indigo-600 text-sm">${description}</p>
                    </div>
                </div>
            </div>
        `;
    });

    // Add special styling for key concepts like "考点提示"
    processed = processed.replace(/\*\*(考点提示)\*\*:([\s\S]*?)(?=\n\n|\n#|\n<hr|<\!--|$)/gs, (match, title, content) => `
        <div class="my-6 p-4 bg-pink-50 border-l-4 border-pink-400 rounded-r-lg shadow">
            <h4 class="text-md font-semibold text-pink-700 mb-2">${title}</h4>
            <div class="text-pink-600 text-sm">${marked.parse(content.trim())}</div>
        </div>
    `);

    // Add styling for analogies like "趣味比喻"
    processed = processed.replace(/\*\*(趣味比喻)\*\*:([\s\S]*?)(?=\n\n|\n#|\n<hr|<\!--|$)/gs, (match, title, content) => `
        <div class="my-6 p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg shadow">
            <h4 class="text-md font-semibold text-emerald-700 mb-2">${title}</h4>
            <div class="text-emerald-600 text-sm">${marked.parse(content.trim())}</div>
        </div>
    `);

    // Add styling for "重点"
     processed = processed.replace(/\*\*(重点)\*\*:([\s\S]*?)(?=\n\n|\n#|\n<hr|<\!--|$)/gs, (match, title, content) => `
        <div class="my-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg shadow">
            <h4 class="text-md font-semibold text-yellow-700 mb-2">${title}</h4>
            <div class="text-yellow-600 text-sm">${marked.parse(content.trim())}</div>
        </div>
    `);

     // Add styling for review/tips like "核心知识点全面回顾", "高效学习与复习建议", "模拟考试热点提示" etc.
    processed = processed.replace(/\*\*(核心知识点全面回顾|模拟考试热点提示|高效学习与复习建议|易错点提醒|典型例题类型提示|复习时间分配建议|最后的鼓励|温馨提示)\*\*:([\s\S]*?)(?=\n\n|\n#|\n<hr|<\!--|$|\n####|\*\*|$)/gs, (match, title, content) => {
        let titleColor = "text-purple-700";
        let bgColor = "bg-purple-50";
        let borderColor = "border-purple-400";
        let contentColor = "text-purple-600";

        const parsedContent = marked.parse(content.trim());

        return `
        <div class="my-6 p-4 ${bgColor} border-l-4 ${borderColor} rounded-r-lg shadow">
            <h4 class="text-md font-semibold ${titleColor} mb-2">${title}</h4>
            <div class="${contentColor} text-sm">${parsedContent}</div>
        </div>
    `});


    // Add styling for '小知识'/'实践小知识'/'学习小贴士'
     processed = processed.replace(/\*\*(实践小知识|小知识|学习小贴士|用途|基本语法|常用参数|结果解读|关键输出信息解读|基本用法|安装与启动|基本界面认识|首次捕获体验|简单筛选技巧|通过一个小案例实战|小结|考点)\*\*:([\s\S]*?)(?=\n\n|\n#|\n<hr|<\!--|$|\n####|\*\*|$)/gs, (match, title, content) => {
        let titleColor = "text-sky-700";
        let bgColor = "bg-sky-50";
        let borderColor = "border-sky-400";
        let contentColor = "text-sky-600";

        if (title === "用途" || title === "基本语法" || title === "常用参数" || title === "结果解读" || title === "关键输出信息解读" || title === "基本用法" || title === "安装与启动" || title === "基本界面认识" || title === "首次捕获体验" || title === "简单筛选技巧" || title === "通过一个小案例实战" || title === "小结" || title.includes("考点")) {
             bgColor = "bg-purple-50"; 
             borderColor = "border-purple-400";
             titleColor = "text-purple-700";
             contentColor = "text-purple-600";
             if (title === "考点提示") { 
                  return match; 
             }
        }

        const parsedContent = marked.parse(content.trim());

        return `
        <div class="my-6 p-4 ${bgColor} border-l-4 ${borderColor} rounded-r-lg shadow">
            <h4 class="text-md font-semibold ${titleColor} mb-2">${title}</h4>
            <div class="${contentColor} text-sm">${parsedContent}</div>
        </div>
    `});

    return processed;
}


function displayChapter(chapterNumber, content, metadata) {
    const chapterInfo = chapterData[chapterNumber];

    // Update reading time using metadata from frontmatter if available, else from chapterData
    const readingTime = metadata.estimated_time || chapterInfo.readingTime || '未知';
    document.getElementById('readingTime').textContent = `预计阅读时间: ${readingTime}`;

    // Update chapter content
    document.getElementById('chapterText').innerHTML = content;

    // Update chapter indicator
    document.getElementById('chapterIndicator').textContent = `第 ${chapterNumber} 章 / 共 ${Object.keys(chapterData).length} 章`;

    // Update navigation buttons
    updateNavigationButtons();

    // Show chapter content section
    document.getElementById('chapters').classList.add('hidden');
    document.getElementById('chapterContent').classList.remove('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update bookmark status (assuming function exists)
    // updateBookmarkButton(chapterNumber);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const totalChapters = Object.keys(chapterData).length;

    // Update previous button
    if (currentChapter <= 1) {
        prevBtn.disabled = true;
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    // Update next button
    if (currentChapter >= totalChapters) {
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextBtn.innerHTML = '<span>已是最后一章</span>';
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
         nextBtn.innerHTML = `<span>下一章</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>`;
    }
}

function backToChapters() {
    document.getElementById('chapterContent').classList.add('hidden');
    document.getElementById('chapters').classList.remove('hidden');
    currentChapter = 0; // Reset current chapter when going back to list
    updateProgress();
}

function previousChapter() {
    if (currentChapter > 1) {
        loadChapter(currentChapter - 1);
    }
}

function nextChapter() {
    const totalChapters = Object.keys(chapterData).length;
    if (currentChapter < totalChapters) {
        loadChapter(currentChapter + 1);
    }
}

function generateProgressDots() {
     const totalChapters = Object.keys(chapterData).length;
     const container = document.getElementById('progress-indicators');
     if (!container) {
         console.error("Progress indicators container not found!");
         return;
     }
     // Clear existing dots if any
     container.innerHTML = '';
     for (let i = 1; i <= totalChapters; i++) {
         const dot = document.createElement('div');
         dot.id = `progress-${i}`;
         dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-gray-200'); // Initial state
         container.appendChild(dot);
     }
      // Ensure the first dot is active on initial load (before any chapter is clicked)
     updateProgress();
}


function updateProgress() {
    const totalChapters = Object.keys(chapterData).length;
    for (let i = 1; i <= totalChapters; i++) {
        const progressEl = document.getElementById(`progress-${i}`);
        if (progressEl) {
            if (i <= currentChapter && currentChapter !== 0) {
                progressEl.classList.remove('bg-gray-200');
                progressEl.classList.add('bg-primary'); // Use primary color for completed/current
            } else {
                progressEl.classList.remove('bg-primary');
                progressEl.classList.add('bg-gray-200'); // Use gray for not yet reached
            }
        } else {
            console.warn(`Progress element for chapter ${i} not found.`);
        }
    }

    const progressText = document.getElementById('progress-text');
    if (progressText) {
        if (currentChapter === 0) {
            progressText.textContent = '开始学习第一章';
        } else if (currentChapter === totalChapters) {
            progressText.textContent = '恭喜完成所有章节！';
             progressText.classList.add('text-accent'); // Change color for completion
             progressText.classList.remove('text-primary');
        } else if (currentChapter > 0 && currentChapter < totalChapters) {
             progressText.textContent = `学习中：第 ${currentChapter} 章`;
             progressText.classList.add('text-primary');
              progressText.classList.remove('text-accent');
        }
    }
}

// Placeholder for other functions like toggleBookmark, updateBookmarkButton, theme toggling, loading indicators, notifications
// function toggleBookmark() { /* ... */ }
// function updateBookmarkButton(chapterNumber) { /* ... */ }
// function toggleTheme() { /* ... */ }
// function showLoading() { /* ... */ }
// function hideLoading() { /* ... */ }
// function showNotification(message, type = 'info') { /* ... */ }




