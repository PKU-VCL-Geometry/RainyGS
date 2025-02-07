// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var position = 0.5;
    var vidWidth = vid.videoWidth / 2;
    var vidHeight = vid.videoHeight;

    // 计算缩放比例
    var scale = vidHeight / 832; // 假设基准高度为1080px
    
    // 固定控件尺寸
    const CONTROLS = {
        circle: {
            radius: 53 * scale,
            lineWidth: 5 * scale
        },
        arrows: {
            size: 16 * scale,
            offset: 28 * scale
        },
        labels: {
            height: 80 * scale,
            padding: 28 * scale,
            fontSize: 45 * scale,
            cornerRadius: 8 * scale,
            bottomOffset: 100 * scale,
            leftWidth: 220 * scale,
            rightWidth: 220 * scale,
            sideMargin: 20 * scale
        }
    };

    var mergeContext = videoMerge.getContext("2d");

    if (vid.readyState > 3) {
        vid.play();

        function trackLocation(e) {
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.pageX - bcr.x) / bcr.width);
        }
        function trackLocationTouch(e) {
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.touches[0].pageX - bcr.x) / bcr.width);
        }

        videoMerge.addEventListener("mousemove", trackLocation, false); 
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove", trackLocationTouch, false);

        function drawLoop() {
            mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
            var colStart = (vidWidth * position).clamp(0.0, vidWidth);
            var colWidth = (vidWidth - (vidWidth * position)).clamp(0.0, vidWidth);
            mergeContext.drawImage(vid, colStart + vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);
            requestAnimationFrame(drawLoop);

            // 分割线
            mergeContext.beginPath();
            var circleCenterX = vidWidth * position;
            mergeContext.moveTo(circleCenterX, 0);
            mergeContext.lineTo(circleCenterX, vidHeight / 2 - CONTROLS.circle.radius);
            mergeContext.moveTo(circleCenterX, vidHeight / 2 + CONTROLS.circle.radius);
            mergeContext.lineTo(circleCenterX, vidHeight);
            mergeContext.closePath();
            mergeContext.strokeStyle = "#FFFFFF";
            mergeContext.lineWidth = CONTROLS.circle.lineWidth;
            mergeContext.stroke();

            // 圆形
            mergeContext.beginPath();
            mergeContext.arc(circleCenterX, vidHeight / 2, CONTROLS.circle.radius, 0, Math.PI * 2, false);
            mergeContext.fillStyle = "rgba(255, 255, 255, 0.2)";
            mergeContext.fill();
            mergeContext.lineWidth = CONTROLS.circle.lineWidth;
            mergeContext.strokeStyle = "#FFFFFF";
            mergeContext.stroke();

            // 箭头
            // 左箭头
            mergeContext.beginPath();
            mergeContext.moveTo(circleCenterX - CONTROLS.arrows.size, vidHeight / 2 - CONTROLS.arrows.size);
            mergeContext.lineTo(circleCenterX - CONTROLS.arrows.offset, vidHeight / 2);
            mergeContext.lineTo(circleCenterX - CONTROLS.arrows.size, vidHeight / 2 + CONTROLS.arrows.size);
            mergeContext.closePath();
            mergeContext.fillStyle = "#FFFFFF";
            mergeContext.fill();

            // 右箭头
            mergeContext.beginPath();
            mergeContext.moveTo(circleCenterX + CONTROLS.arrows.size, vidHeight / 2 - CONTROLS.arrows.size);
            mergeContext.lineTo(circleCenterX + CONTROLS.arrows.offset, vidHeight / 2);
            mergeContext.lineTo(circleCenterX + CONTROLS.arrows.size, vidHeight / 2 + CONTROLS.arrows.size);
            mergeContext.closePath();
            mergeContext.fillStyle = "#FFFFFF";
            mergeContext.fill();

            // 文本标签
            const rectY = vidHeight - CONTROLS.labels.bottomOffset;
            
            // 左侧标签
            mergeContext.save();
            mergeContext.beginPath();
            mergeContext.rect(0, 0, vidWidth * position - CONTROLS.circle.lineWidth / 2, vidHeight);
            mergeContext.clip();

            drawRoundedRect(
                mergeContext,
                CONTROLS.labels.sideMargin,
                rectY,
                CONTROLS.labels.leftWidth,
                CONTROLS.labels.height,
                CONTROLS.labels.cornerRadius
            );

            mergeContext.fillStyle = "#FFFFFF";
            mergeContext.font = `${CONTROLS.labels.fontSize}px 'Noto Sans', sans-serif`;
            mergeContext.fillText(
                "Original",
                CONTROLS.labels.sideMargin + CONTROLS.labels.padding,
                rectY + CONTROLS.labels.height - CONTROLS.labels.padding
            );
            mergeContext.restore();

            // 右侧标签
            mergeContext.save();
            mergeContext.beginPath();
            mergeContext.rect(vidWidth * position + CONTROLS.circle.lineWidth / 2, 0, vidWidth - vidWidth * position, vidHeight);
            mergeContext.clip();

            drawRoundedRect(
                mergeContext,
                vidWidth - CONTROLS.labels.rightWidth - CONTROLS.labels.sideMargin,
                rectY,
                CONTROLS.labels.rightWidth,
                CONTROLS.labels.height,
                CONTROLS.labels.cornerRadius
            );

            mergeContext.fillStyle = "#FFFFFF";
            mergeContext.font = `${CONTROLS.labels.fontSize}px 'Noto Sans', sans-serif`;
            mergeContext.fillText(
                "RainyGS",
                vidWidth - CONTROLS.labels.rightWidth - CONTROLS.labels.sideMargin + CONTROLS.labels.padding,
                rectY + CONTROLS.labels.height - CONTROLS.labels.padding
            );
            mergeContext.restore();
        }   

        requestAnimationFrame(drawLoop);
    } 
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fillStyle = "#121212";
    ctx.fill();
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
    
function resizeAndPlay(element) {
    var cv = document.getElementById(element.id + "Merge");
    cv.width = element.videoWidth / 2;
    cv.height = element.videoHeight;
    element.play();
    element.style.height = "0px";
    playVids(element.id);
}

// function playVids(videoId) {
//     var videoMerge = document.getElementById(videoId + "Merge");
//     var vid = document.getElementById(videoId);

//     var position = 0.5;
//     var vidWidth = vid.videoWidth / 2;
//     var vidHeight = vid.videoHeight;

//     // var widthRatio = vid.videoWidth / 2532;
//     // var heightRatio = vid.videoHeight / 832; 
//     // var vidWidth = vid.videoWidth / (2 * widthRatio);
//     // var vidHeight = vid.videoHeight / (1 * heightRatio);

//     var mergeContext = videoMerge.getContext("2d");

    
//     if (vid.readyState > 3) {
//         vid.play();

//         function trackLocation(e) {
//             // Normalize to [0, 1]
//             bcr = videoMerge.getBoundingClientRect();
//             position = ((e.pageX - bcr.x) / bcr.width);
//         }
//         function trackLocationTouch(e) {
//             // Normalize to [0, 1]
//             bcr = videoMerge.getBoundingClientRect();
//             position = ((e.touches[0].pageX - bcr.x) / bcr.width);
//         }

//         videoMerge.addEventListener("mousemove",  trackLocation, false); 
//         videoMerge.addEventListener("touchstart", trackLocationTouch, false);
//         videoMerge.addEventListener("touchmove",  trackLocationTouch, false);


//         function drawLoop() {
//             mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
//             var colStart = (vidWidth * position).clamp(0.0, vidWidth);
//             var colWidth = (vidWidth - (vidWidth * position)).clamp(0.0, vidWidth);
//             mergeContext.drawImage(vid, colStart + vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);
//             requestAnimationFrame(drawLoop);
            

//             //// Divider Line

//             // Hyperparameters
//             var circle_radius = 50;         // Circle radius
//             var stroke_color = "#FFFFFF";   // Line color (white)
//             var line_width = 4;             // Line width

//             mergeContext.beginPath();
//             // Get the center position and radius of the circle
//             var circleCenterX = vidWidth * position;
//             var circleRadius = circle_radius;
//             // Draw the divider line: top part
//             mergeContext.moveTo(circleCenterX, 0);
//             mergeContext.lineTo(circleCenterX, vidHeight / 2 - circleRadius);  // To the top of the circle
//             // Draw the divider line: bottom part
//             mergeContext.moveTo(circleCenterX, vidHeight / 2 + circleRadius);  // Start from below the circle
//             mergeContext.lineTo(circleCenterX, vidHeight);  // Continue to the bottom
//             mergeContext.closePath();
//             mergeContext.strokeStyle = stroke_color;
//             mergeContext.lineWidth = line_width;
//             mergeContext.stroke();

//             //// Circle
//             mergeContext.beginPath();
//             mergeContext.arc(circleCenterX, vidHeight / 2, circleRadius, 0, Math.PI * 2, false);
//             mergeContext.fillStyle = "rgba(255, 255, 255, 0.2)"; // White with transparency
//             mergeContext.fill();
//             mergeContext.closePath();
//             // Add white border to the circle
//             mergeContext.lineWidth = line_width; // Set border width
//             mergeContext.strokeStyle = stroke_color; // White border
//             mergeContext.stroke(); // Draw the border
            
//             //// Arrows
//             // Left arrow
//             mergeContext.beginPath();
//             mergeContext.moveTo(vidWidth * position - 12, vidHeight / 2 - 15); // Left arrow start
//             mergeContext.lineTo(vidWidth * position - 25, vidHeight / 2); // Left arrow point
//             mergeContext.lineTo(vidWidth * position - 12, vidHeight / 2 + 15); // Left arrow end
//             mergeContext.closePath();
//             mergeContext.fillStyle = stroke_color; // White arrow
//             mergeContext.fill();
//             // Right arrow
//             mergeContext.beginPath();
//             mergeContext.moveTo(vidWidth * position + 12, vidHeight / 2 - 15); // Right arrow start
//             mergeContext.lineTo(vidWidth * position + 25, vidHeight / 2); // Right arrow point
//             mergeContext.lineTo(vidWidth * position + 12, vidHeight / 2 + 15); // Right arrow end
//             mergeContext.closePath();
//             mergeContext.fillStyle = stroke_color; // White arrow
//             mergeContext.fill();
            
//             //// Text Labels
//             // Hyperparameters
//             var padding = 21;

//             var rectX = 50; // X position of the background
//             var rectY = vidHeight - 120; // Y position of the background
//             var rectWidth_left = 220; // Width of the rectangle (adjustable)
//             var text_left = "Original";

//             var rectWidth_right = 220;
//             var rectXRight = vidWidth - rectWidth_right - 50;  // Adjust X for the right label, so it appears on the right side
//             var rectYRight = rectY;  // Same Y position for consistency
//             var text_right = "RainyGS";

//             var rectHeight = 80; // Height of the rectangle (adjustable)
//             var cornerRadius = 8; // Radius for rounded corners
//             var rect_color = "#121212"
//             var font_color = "#FFFFFF";
//             var font_style = "3em 'Noto Sans', sans-serif"


//             // Clip the region to ensure text is hidden based on position
//             mergeContext.save();
//             mergeContext.beginPath();
//             mergeContext.rect(0, 0, vidWidth * position - line_width / 2, vidHeight);
//             mergeContext.clip();  // This will mask the left portion, hiding the text on the left side of the line.

//             // Set fill color for the background
//             mergeContext.fillStyle = rect_color; // Black background
//             // Draw the rounded rectangle
//             mergeContext.beginPath();
//             mergeContext.moveTo(rectX + cornerRadius, rectY); // Move to top left corner with radius
//             mergeContext.lineTo(rectX + rectWidth_left - cornerRadius, rectY); // Top edge
//             mergeContext.arcTo(rectX + rectWidth_left, rectY, rectX + rectWidth_left, rectY + rectHeight, cornerRadius); // Top-right corner
//             mergeContext.lineTo(rectX + rectWidth_left, rectY + rectHeight - cornerRadius); // Right edge
//             mergeContext.arcTo(rectX + rectWidth_left, rectY + rectHeight, rectX + rectWidth_left - cornerRadius, rectY + rectHeight, cornerRadius); // Bottom-right corner
//             mergeContext.lineTo(rectX + cornerRadius, rectY + rectHeight); // Bottom edge
//             mergeContext.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius); // Bottom-left corner
//             mergeContext.lineTo(rectX, rectY + cornerRadius); // Left edge
//             mergeContext.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius); // Top-left corner

//             mergeContext.closePath();
//             mergeContext.fill(); // Fill the background

//             // Left text label
//             mergeContext.fillStyle = font_color; // Set text color to white
//             mergeContext.font = font_style; // Set font style
//             mergeContext.fillText(text_left, rectX + padding, rectY + rectHeight - padding); // Draw text inside the background
//             mergeContext.restore();


//             // Right text label (RainyGS)
//             mergeContext.save();
//             mergeContext.beginPath();
//             mergeContext.rect(vidWidth * position + line_width / 2, 0, vidWidth - vidWidth * position, vidHeight);  // Clip the region to mask the right side based on the position
//             mergeContext.clip();  // This will mask the right portion, hiding the text on the right side of the line.
//             // Draw the rounded rectangle for the right label (RainyGS)
//             mergeContext.fillStyle = rect_color; // Black background
//             // Draw the rounded rectangle for the right label
//             mergeContext.beginPath();
//             mergeContext.moveTo(rectXRight + cornerRadius, rectYRight); // Move to top left corner with radius
//             mergeContext.lineTo(rectXRight + rectWidth_right - cornerRadius, rectYRight); // Top edge
//             mergeContext.arcTo(rectXRight + rectWidth_right, rectYRight, rectXRight + rectWidth_right, rectYRight + rectHeight, cornerRadius); // Top-right corner
//             mergeContext.lineTo(rectXRight + rectWidth_right, rectYRight + rectHeight - cornerRadius); // Right edge
//             mergeContext.arcTo(rectXRight + rectWidth_right, rectYRight + rectHeight, rectXRight + rectWidth_right - cornerRadius, rectYRight + rectHeight, cornerRadius); // Bottom-right corner
//             mergeContext.lineTo(rectXRight + cornerRadius, rectYRight + rectHeight); // Bottom edge
//             mergeContext.arcTo(rectXRight, rectYRight + rectHeight, rectXRight, rectYRight + rectHeight - cornerRadius, cornerRadius); // Bottom-left corner
//             mergeContext.lineTo(rectXRight, rectYRight + cornerRadius); // Left edge
//             mergeContext.arcTo(rectXRight, rectYRight, rectXRight + cornerRadius, rectYRight, cornerRadius); // Top-left corner

//             mergeContext.closePath();
//             mergeContext.fill(); // Fill the background

//             // Draw the right text inside the background
//             mergeContext.fillStyle = font_color; // Set text color to white
//             mergeContext.font = font_style; // Set font style
//             mergeContext.fillText(text_right, rectXRight + padding, rectYRight + rectHeight - padding);

//             mergeContext.restore();

//         }   

//         requestAnimationFrame(drawLoop);
//     } 
// }

// Number.prototype.clamp = function(min, max) {
// return Math.min(Math.max(this, min), max);
// };
    
// function resizeAndPlay(element)
// {
//     var cv = document.getElementById(element.id + "Merge");
//     cv.width = element.videoWidth / 2;
//     cv.height = element.videoHeight;

//     // var widthRatio = element.videoWidth / 2532;
//     // var heightRatio = element.videoHeight / 832; 
//     // cv.width = element.videoWidth / (2 * widthRatio);
//     // cv.height = element.videoHeight / (1 * heightRatio);

//     element.play();
//     element.style.height = "0px";  // Hide video without stopping it
        
//     playVids(element.id);
// }