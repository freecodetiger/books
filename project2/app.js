// 应用主要逻辑
class TutorialApp {
    constructor() {
        this.contentContainer = document.getElementById('content');
        this.tutorialNav = document.getElementById('tutorial-nav');
        this.currentChapterFile = null;
        this.init();
    }
    
    async init() {
        this.setupNavigation();
        
        let initialChapterFile = "";
        const hash = window.location.hash.substring(1); // Remove #
        
        if (hash) {
            initialChapterFile = hash.split('/')[0]; // Get chapter name, ignore section
            if (initialChapterFile && !initialChapterFile.endsWith('.md')) {
                initialChapterFile += '.md';
            }
        }

        if (!initialChapterFile && this.tutorialNav && this.tutorialNav.querySelector('a[data-chapter]')) {
            initialChapterFile = this.tutorialNav.querySelector('a[data-chapter]').dataset.chapter;
        } else if (!initialChapterFile) {
            initialChapterFile = 'chapter1.md'; // Fallback
        }
        
        try {
            await this.loadChapter(initialChapterFile);
            // After content loads, check if there's a section ID in the hash and scroll to it
            if (hash && hash.includes('/')) {
                const sectionId = hash.split('/')[1];
                if (sectionId) {
                    setTimeout(() => { // Ensure content is rendered
                        const element = document.getElementById(sectionId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                             // Optional: highlight the section
                            element.classList.add('highlight-section');
                            setTimeout(() => element.classList.remove('highlight-section'), 2000);
                        }
                    }, 100); // Small delay for rendering
                }
            }
        } catch (error) {
            this.showError(`加载初始教程内容 (${initialChapterFile}) 时出现严重错误。请检查文件是否存在或刷新页面。`);
            console.error(`Fatal Error loading initial tutorial (${initialChapterFile}):`, error);
        }
    }

    setupNavigation() {
        if (!this.tutorialNav) return;

        this.tutorialNav.addEventListener('click', (event) => {
            const targetLink = event.target.closest('a[data-chapter]');
            if (targetLink) {
                event.preventDefault();
                const chapterFile = targetLink.dataset.chapter;
                if (chapterFile !== this.currentChapterFile) {
                    this.loadChapter(chapterFile)
                        .catch(error => {
                             console.warn(`Navigation click error for ${chapterFile}:`, error);
                        });
                }
            }
        });

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            let chapterFileFromHash = "";

            if (hash) {
                chapterFileFromHash = hash.split('/')[0]; // Get chapter name, ignore section
                if (chapterFileFromHash && !chapterFileFromHash.endsWith('.md')) {
                    chapterFileFromHash += '.md';
                }
            }
            
            if (chapterFileFromHash && chapterFileFromHash !== this.currentChapterFile) {
                this.loadChapter(chapterFileFromHash).catch(err => console.error("Error loading from hashchange:", err));
            } else if (chapterFileFromHash && chapterFileFromHash === this.currentChapterFile && hash.includes('/')) {
                // Chapter is the same, but section might have changed. Scroll to section.
                const sectionId = hash.split('/')[1];
                if (sectionId) {
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        element.classList.add('highlight-section');
                        setTimeout(() => element.classList.remove('highlight-section'), 2000);
                    }
                }
            }
        });
    }
    
    async loadChapter(filename) {
        this.contentContainer.innerHTML = `
            <div class="text-center py-16">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                <p class="mt-6 text-xl text-gray-600">正在加载魔法篇章: ${filename}...</p>
            </div>
        `;
        
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`艾欧尼亚的网络波动了！(HTTP ${response.status})`);
            }
            const content = await response.text();
            this.parseAndRender(content, filename);
            this.currentChapterFile = filename;
            this.updateActiveNavLink(filename);
            // Only update hash if it doesn't already contain this chapter
            // or if it's a simple chapter hash without section
            const currentHashChapter = window.location.hash.substring(1).split('/')[0];
            if (currentHashChapter !== filename.replace('.md', '')) {
                 window.location.hash = filename.replace('.md', ''); // Update URL hash to chapter root
            }
           
        } catch (error) {
            this.showError(`加载章节 '${filename}' 失败: ${error.message} <br>可能是章节文件不存在或路径错误。`);
            console.error(`Failed to load ${filename}:`, error);
            this.currentChapterFile = null; // Reset current chapter on failure
            this.updateActiveNavLink(null); // Clear active link
        }
    }
    
    parseAndRender(content, filename) {
        try {
            const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
            let metadata = {};
            let markdownContent = content;
            
            if (frontMatterMatch) {
                const yamlString = frontMatterMatch[1];
                markdownContent = frontMatterMatch[2];
                try {
                    metadata = jsyaml.load(yamlString);
                } catch (yamlError) {
                    console.warn(`YAML Front Matter 解析失败 (${filename}):`, yamlError);
                    this.showToast(`警告：${filename} 的元数据解析失败，部分功能可能受影响。`, 'warning');
                }
            }
            
            const htmlContent = marked.parse(markdownContent);
            this.renderContent(metadata, htmlContent, filename);
            
        } catch (error) {
            this.showError(`解析教程内容 (${filename}) 时施法出错: ${error.message}`);
            console.error(`Parse error (${filename}):`, error);
        }
    }
    
    renderContent(metadata, htmlContent, filename) {
        // Update page title
        const baseTitle = "WEB 全栈开发教程";
        if (metadata.title) {
            document.title = `${metadata.title} | ${baseTitle}`;
        } else {
            const fallbackTitle = filename.replace('.md', '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            document.title = `${fallbackTitle} | ${baseTitle}`;
        }

        this.contentContainer.innerHTML = htmlContent;
        this.addInteractiveFunctions();
        // Scroll to top only if not handling a section scroll from init or hashchange
        const hash = window.location.hash.substring(1);
        if (!hash.includes('/')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updateActiveNavLink(filename) {
        if (!this.tutorialNav) return;
        
        const links = this.tutorialNav.querySelectorAll('a[data-chapter]');
        links.forEach(link => {
            if (link.dataset.chapter === filename) {
                link.classList.add('nav-active');
                link.classList.remove('text-gray-700', 'hover:bg-gray-200', 'hover:text-gray-900');
            } else {
                link.classList.remove('nav-active');
                link.classList.add('text-gray-700', 'hover:bg-gray-200', 'hover:text-gray-900');
            }
        });
    }
    
    addInteractiveFunctions() {
        this.addAnchorLinks();
        this.addCodeCopyButtons();
        this.addImageZoom();
        Prism.highlightAllUnder(this.contentContainer); // Re-run Prism for new content
    }
    
    addAnchorLinks() {
        const headings = this.contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            if(heading.id) return; // Don't overwrite existing IDs
            
            let originalId = heading.getAttribute('id'); // Use original id if provided by marked.js
            if (!originalId) {
                 originalId = this.generateId(heading.textContent);
                 heading.id = originalId;
            }

            heading.classList.add('group', 'relative', 'cursor-pointer', 'hover:text-blue-700', 'transition-colors', 'duration-150');
            
            const anchorIcon = document.createElement('span');
            anchorIcon.innerHTML = '#';
            anchorIcon.className = 'absolute -left-5 top-1/2 -translate-y-1/2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xl';
            heading.prepend(anchorIcon);

            heading.addEventListener('click', (e) => {
                if (e.target === anchorIcon) e.stopPropagation(); 
                
                const sectionHash = `${this.currentChapterFile.replace('.md','')}/${originalId}`;
                window.location.hash = sectionHash; // This will trigger hashchange or browser scroll

                const fullUrl = `${window.location.origin}${window.location.pathname}#${sectionHash}`;
                navigator.clipboard.writeText(fullUrl).then(() => {
                    this.showToast('章节内链接已复制到剪贴板！');
                }).catch(err => {
                    this.showToast('复制失败，浏览器可能不支持或未授权。', 'error');
                    console.error('Failed to copy link: ', err);
                });
            });
        });
    }
    
    addCodeCopyButtons() {
        const codeBlocks = this.contentContainer.querySelectorAll('pre'); 
        codeBlocks.forEach(preElement => {
            if (preElement.querySelector('.code-copy-button')) return;

            const codeElement = preElement.querySelector('code');
            const codeToCopy = codeElement ? codeElement.textContent : preElement.textContent;

            const button = document.createElement('button');
            button.innerHTML = '📋 <span class="sr-only">复制代码</span>'; 
            button.className = 'code-copy-button absolute top-2 right-2 bg-gray-700 text-white px-3 py-1.5 rounded-md text-xs hover:bg-gray-600 active:bg-gray-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 opacity-75 hover:opacity-100';
            
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    button.innerHTML = '✅ <span class="sr-only">已复制</span>';
                    setTimeout(() => {
                        button.innerHTML = '📋 <span class="sr-only">复制代码</span>';
                    }, 2000);
                }).catch(err => {
                    button.innerHTML = '❌ <span class="sr-only">复制失败</span>';
                     console.error('Code copy failed:', err);
                    setTimeout(() => {
                         button.innerHTML = '📋 <span class="sr-only">复制代码</span>';
                    }, 2000);
                });
            });
            
            preElement.style.position = 'relative'; 
            preElement.appendChild(button);
        });
    }
    
    addImageZoom() {
        const images = this.contentContainer.querySelectorAll('img');
        images.forEach(img => {
            if (img.dataset.zoomedSetup) return;
            img.dataset.zoomedSetup = 'true';

            img.style.cursor = 'zoom-in';
            img.title = '点击查看大图';
            
            img.addEventListener('click', () => {
                if (img.closest('a')) return;
                this.showImageModal(img.src, img.alt);
            });
        });
    }
    
    generateId(text) {
        if (!text) return `section-${Math.random().toString(36).substring(2,9)}`;
        // Simplified ID generation, marked.js might already provide good IDs.
        // This is a fallback.
        return text.trim().toLowerCase()
            .replace(/[^\w\s-]/g, '') 
            .replace(/\s+/g, '-')    
            .replace(/-+/g, '-')     
            .replace(/^-+|-+$/g, ''); 
    }
    
    showToast(message, type = 'success') {
        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        let bgColor = 'bg-green-500'; 
        if (type === 'error') bgColor = 'bg-red-500';
        if (type === 'warning') bgColor = 'bg-yellow-500';
        if (type === 'info') bgColor = 'bg-blue-500';

        toast.className = `fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl z-[100] transform translate-x-full transition-transform duration-300 ease-out text-sm`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => { 
            toast.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            toast.style.transform = 'translateX(calc(100% + 20px))'; 
            toast.addEventListener('transitionend', () => {
                 if(document.body.contains(toast)) document.body.removeChild(toast);
            }, { once: true });
        }, 3500);
    }
    
    showImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[90] p-4 backdrop-blur-sm';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'image-modal-caption');

        const figure = document.createElement('figure');
        figure.className = 'relative max-w-full max-h-full flex flex-col items-center';

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = 'block max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain';
        
        const caption = document.createElement('figcaption');
        caption.id = 'image-modal-caption';
        caption.textContent = alt || '放大图片';
        caption.className = 'text-white text-center mt-3 p-2 bg-black bg-opacity-50 rounded-md text-sm';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;'; 
        closeBtn.setAttribute('aria-label', '关闭图片预览');
        closeBtn.className = 'absolute -top-3 -right-3 text-white text-4xl font-light bg-gray-800 bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center leading-none hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white';
        
        figure.appendChild(img);
        if (alt) figure.appendChild(caption); 
        modal.appendChild(figure);
        modal.appendChild(closeBtn);
        
        const close = () => {
            modal.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            modal.addEventListener('transitionend', () => {
                if(document.body.contains(modal)) document.body.removeChild(modal);
            }, { once: true });
        };
        
        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close(); 
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        }, { once: true }); 
        
        document.body.appendChild(modal);
        modal.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        requestAnimationFrame(() => modal.classList.remove('opacity-0')); 
    }
    
    showError(message) {
        this.contentContainer.innerHTML = `
            <div class="text-center py-16 px-6 bg-red-50 border border-red-200 rounded-lg">
                <div class="text-7xl mb-6">🤯</div>
                <h2 class="text-3xl font-bold text-red-700 mb-4">糟糕，施法中断！</h2>
                <p class="text-red-600 text-lg mb-8">${message}</p>
                <button onclick="window.location.reload()" class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold shadow-md hover:shadow-lg">
                    🔄 施展「时光倒流」(重试)
                </button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.tutorialApp = new TutorialApp();
});




