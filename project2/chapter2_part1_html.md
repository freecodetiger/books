这个表单收集了姓名、邮箱、主题、意见，并提供了一个订阅选项。当用户点击“提交信息”按钮时，浏览器会将这些数据打包，按照`method="POST"`的方式发送到`/contact-us`这个地址。后端服务器（我们以后会学怎么写！）接收到数据后就可以进行处理了。

## 四、HTML5 的“新玩具箱”：新特性一览

HTML5带来了许多令人兴奋的新功能，让HTML变得更强大、更语义化。

1.  **新的语义化标签**：我们前面已经介绍过 `<header>`, `<footer>`, `<nav>`, `<article>`, `<section>`, `<aside>`。它们让文档结构更清晰。还有一个 `<main>` 标签，用来包裹页面的主要内容区域，每个页面通常只用一个。

2.  **媒体标签：`<audio>` 和 `<video>`**
    以前在网页中播放音频和视频通常需要依赖Flash等插件，HTML5内置了这两个标签，让多媒体播放变得轻而易举！

    *   **`<audio>`**: 播放音频。
        ```html
        <audio controls src="music/epic_song.mp3">
            您的浏览器不支持 audio 标签，听不了这首史诗级BGM了。
        </audio>
        ```
        `controls` 属性会显示浏览器默认的播放控件（播放/暂停、音量等）。标签中间的文字是后备内容，在不支持`<audio>`的古董浏览器中显示。

    *   **`<video>`**: 播放视频。
        ```html
        <video controls width="640" height="360" poster="images/video_preview.jpg">
            <source src="videos/cool_animation.mp4" type="video/mp4">
            <source src="videos/cool_animation.webm" type="video/webm">
            抱歉，您的浏览器不支持 video 标签，精彩动画看不了啦！
        </video>
        ```
        *   `width` 和 `height` 可以设置视频播放器的尺寸。
        *   `poster` 属性可以指定一个视频封面图片，在视频加载完成前显示。
        *   可以使用多个 `<source>` 标签来提供不同格式的视频文件，浏览器会自动选择它支持的第一个格式进行播放。这是为了兼容不同的浏览器。
        *   `autoplay` 属性可以让媒体自动播放 (某些浏览器可能会限制自动播放，尤其是带声音的)。
        *   `loop` 属性可以让媒体循环播放。

3.  **`<canvas>`**: 这是一个“数字画布”，你可以通过JavaScript在上面绘制图形、动画、图表，甚至制作游戏。它本身只是一个矩形区域，真正的魔法由JavaScript来施展。
    ```html
    <canvas id="myDrawingCanvas" width="200" height="100" style="border:1px solid #000;"></canvas>
    <script>
        // JavaScript 代码来在 canvas 上画画
        const canvas = document.getElementById('myDrawingCanvas');
        if (canvas.getContext) {
            const ctx = canvas.getContext('2d'); // 获取2D渲染上下文
            ctx.fillStyle = 'rgb(200, 0, 0)';
            ctx.fillRect(10, 10, 50, 50); // 画一个红色方块
        }
    </script>
    ```
    我们暂时只做了解，JavaScript部分会更深入。

4.  **`<svg>` (Scalable Vector Graphics)**: SVG是一种基于XML的矢量图形格式。用SVG绘制的图形可以无限放大而不失真，非常适合用来做图标、Logo、复杂插画等。你可以直接在HTML中嵌入SVG代码，也可以通过`<img>`或CSS背景引入`.svg`文件。
    ```html
    <svg width="100" height="100">
       <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
       Sorry, your browser does not support inline SVG.
    </svg>
    ```
    这会在页面上画一个黄底绿边的圆圈。SVG也是一个大学问，我们先知道有这么个厉害的工具。

HTML5还有很多其他新特性，比如新的表单输入类型 (`date`, `color`, `range`等)、地理定位API、Web Storage (localStorage/sessionStorage) 等，我们会在后续的课程中逐步接触。

## 五、HTML 的“葵花宝典”：最佳实践

写HTML不仅仅是把标签堆砌起来，写出高质量、专业水准的HTML代码，有一些重要的原则和技巧需要遵循：

1.  **语义为王 (Semantic HTML First!)**:
    *   **用正确的标签做正确的事**。比如，导航链接用 `<nav>` 包裹，文章用 `<article>`，小节用 `<section>`，不要仅仅为了样式而随意使用 `<div>` 或 `<span>`。
    *   **思考内容的结构和意义**，选择最能表达该意义的标签。
    *   **好处多多**：提升可访问性、SEO效果，代码更易读、易维护。想象一下，如果房子的承重墙用的是空心砖，那多危险！语义标签就是网页结构的“承重墙”。

2.  **可访问性 (Accessibility, A11y)**:
    *   **让你的网站对所有人可用**，包括残障人士（如视障、听障、行动不便者）。
    *   **为所有`<img>`提供有意义的`alt`文本**。如果图片纯粹是装饰性的，`alt`可以为空 (`alt=""`)，这样屏幕阅读器会跳过它。
    *   **确保表单控件与`<label>`正确关联** (使用`for`和`id`)。
    *   **保持良好的标题层级结构** (`<h1>` -> `<h2>` -> `<h3>`...)。
    *   **确保链接文本清晰明了**，用户能知道点击后会去哪里。避免使用“点击这里”这样的模糊链接。
    *   **颜色对比度要足够**，方便视力不佳的用户阅读。
    *   **键盘导航友好**：确保所有交互元素都能通过键盘访问和操作。
    *   **ARIA (Accessible Rich Internet Applications) Roles 简介**: ARIA是一组特殊的属性，可以添加到HTML标签上，以增强其语义，特别是在创建复杂的Web应用和小部件时。例如，你可以给一个用`<div>`模拟的按钮添加 `role="button"`。
        ```html
        <div role="button" tabindex="0" onclick="doSomething()">一个用div做的按钮</div>
        ```
        `tabindex="0"` 使得这个 `div` 可以通过键盘 Tab 键聚焦。
        **重要原则**：**优先使用原生的HTML语义标签！** 如果HTML已经提供了具有所需语义和行为的标签（比如`<button>`），就用它。只有在无法用原生HTML实现所需的可访问性语义时，才考虑使用ARIA。滥用ARIA反而可能让事情更糟。

3.  **SEO 友好 (Search Engine Optimization)**:
    *   **良好的语义结构**本身就有利于SEO。
    *   **使用`<title>`标签**写出吸引人且相关的页面标题。
    *   **合理使用标题标签 `<h1>`-`<h6>`** 来组织内容，突出关键词。
    *   **`<img>`的`alt`文本** 也有助于图片搜索。
    *   **`<meta name="description" content="页面描述...">`**: 在`<head>`中添加页面描述，搜索引擎可能会在搜索结果中显示它。

4.  **代码规范与整洁**:
    *   **保持一致的缩进和格式化**，让代码易于阅读。很多代码编辑器都有自动格式化功能。
    *   **标签名和属性名使用小写字母** (虽然HTML不区分大小写，但小写是约定俗成的规范)。
    *   **属性值用双引号包裹** (单引号也可以，但双引号更常见)。
    *   **适当添加注释** (`<!-- 这是注释 -->`) 来解释复杂的代码段或标记重要区域，但不要过度注释显而易见的东西。
    *   **验证你的HTML代码**: 使用W3C的HTML验证服务 (validator.w3.org) 或浏览器开发者工具来检查代码是否有错误。

5.  **闭合标签**: 大部分HTML标签是成对出现的 (如`<p>...</p>`)，确保正确闭合它们。有些标签是自闭合的 (如`<img>`, `<br>`, `<hr>`, `<input>`)，在HTML5中，末尾的斜杠 (`/>`) 是可选的，但为了XHTML兼容性和代码清晰性，有些人喜欢写成 `<img src="..." alt="...">` 或 `<img src="..." alt="..." />`。

掌握了这些，你写的HTML代码就会像一位经验丰富的老工匠打磨出来的艺术品一样，既美观又实用！

## 小结与展望

呼～恭喜你，完成了HTML基础知识的巡礼！我们学习了HTML的文档结构，认识了各种常用的标签和它们的语义，了解了如何设计表单来与用户互动，还瞥见了HTML5带来的新酷功能和编写高质量HTML的最佳实践。

现在，你已经拥有了搭建网页“骨架”的能力。不过，一个只有骨架的“毛坯房”还不够吸引人，对吧？下一站，我们将学习CSS——网页的“时尚造型师”，看看如何用它来为我们的HTML骨架穿上华丽的外衣，让它变得赏心悦目！

保持好奇，继续探索，前端的魔法世界才刚刚为你拉开序幕！记得动手练习哦，没有什么比亲手敲出一个个标签，看着它们在浏览器中变成真实的网页元素更有成就感了！










