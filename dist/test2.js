(async () => {
    const { Buffer, Level, PIXI, Brick, Rubber, Water, BrickTriangle, RubberTriangle } = await import("./index.js");
    globalThis.PIXI = PIXI;
    const r = await fetch("../res/level.001");
    const ab = await r.arrayBuffer();
    const buffer = Buffer.from(ab);
    console.log(buffer)
    const level = Level.fromBinary(buffer, 0);
    console.log(level);
    const outBuffer = level.toBinary();
    console.log(outBuffer);
    console.log(outBuffer.equals(buffer));

    const textureFiles = new Set();
    for (let i = 0; i < level.objects.length; i++) {
        const obj = level.objects[i];
        obj.constructor.TEXTURES.forEach(t => textureFiles.add(t));
    }
    /** @type {Record<string, import("pixi.js").BaseTexture>} */
    const textures = {};
    textureFiles.forEach(f => textures[f] = PIXI.Texture.from(`../res/tex/${f}`));


    const backgroundColor = 0xAADDEE;

    let app = new PIXI.Application({ width: document.body.clientWidth, height: document.body.clientHeight });
    globalThis.app = app;
    document.body.appendChild(app.view);
    app.renderer.backgroundColor = backgroundColor;

    const moving = new PIXI.Container();
    const tilingMasks = new PIXI.Container();
    const tilingGraphics = new PIXI.Container();
    moving.addChild(tilingGraphics);
    const bricksGraphic = new PIXI.Graphics();
    const rubberGraphic = new PIXI.Graphics();
    const waterGraphic = new PIXI.Graphics();
    tilingGraphics.addChild(bricksGraphic);
    tilingGraphics.addChild(rubberGraphic);
    tilingGraphics.addChild(waterGraphic);

    const brickTex = textures[Brick.TEXTURES[0]];
    const bricksSprite = new PIXI.TilingSprite(brickTex, app.renderer.width, app.renderer.height);
    const rubberTex = textures[Rubber.TEXTURES[0]];
    const rubberSprite = new PIXI.TilingSprite(rubberTex, app.renderer.width, app.renderer.height);
    const waterTex = textures[Water.TEXTURES[0]];
    const waterSprite = new PIXI.TilingSprite(waterTex, app.renderer.width, app.renderer.height);

    tilingMasks.addChild(waterSprite);
    tilingMasks.addChild(bricksSprite);
    tilingMasks.addChild(rubberSprite);

    bricksGraphic.beginFill();
    rubberGraphic.beginFill();
    waterGraphic.beginFill();
    for (let i = 0; i < level.objects.length; i++) {
        const obj = level.objects[i];
        if (obj instanceof Brick && obj.type === "brick") {
            const { x1, y1, x2, y2 } = obj;
            bricksGraphic.drawRect(x1, y1, x2 - x1, y2 - y1);
        } else if (obj instanceof BrickTriangle && obj.type === "brick_tri") {
            const { x1, y1, facing, size } = obj;
            if (facing === BrickTriangle.FACING.leftBottom) bricksGraphic.drawPolygon(x1, y1, x1, y1 + size, x1 + size, y1 + size);
            if (facing === BrickTriangle.FACING.leftTop) bricksGraphic.drawPolygon(x1, y1, x1 + size, y1, x1, y1 + size);
            if (facing === BrickTriangle.FACING.rightBottom) bricksGraphic.drawPolygon(x1 + size, y1, x1 + size, y1 + size, x1, y1 + size);
            if (facing === BrickTriangle.FACING.rightTop) bricksGraphic.drawPolygon(x1, y1, x1 + size, y1, x1 + size, y1 + size);
        } else if (obj instanceof Rubber && obj.type === "bounce") {
            const { x1, y1, x2, y2 } = obj;
            rubberGraphic.drawRect(x1, y1, x2 - x1, y2 - y1);
        } else if (obj instanceof RubberTriangle && obj.type === "bounce_tri") {
            const { x1, y1, facing, size } = obj;
            if (facing === RubberTriangle.FACING.leftBottom) rubberGraphic.drawPolygon(x1, y1, x1, y1 + size, x1 + size, y1 + size);
            if (facing === RubberTriangle.FACING.leftTop) rubberGraphic.drawPolygon(x1, y1, x1 + size, y1, x1, y1 + size);
            if (facing === RubberTriangle.FACING.rightBottom) rubberGraphic.drawPolygon(x1 + size, y1, x1 + size, y1 + size, x1, y1 + size);
            if (facing === RubberTriangle.FACING.rightTop) rubberGraphic.drawPolygon(x1, y1, x1 + size, y1, x1 + size, y1 + size);
        } else if (obj instanceof Water && obj.type === "water") {
            const { x1, y1, x2, y2 } = obj;
            waterGraphic.drawRect(x1, y1, x2 - x1, y2 - y1);
        }
    }
    bricksGraphic.endFill();
    rubberGraphic.endFill();
    waterGraphic.endFill();
    
    bricksSprite.mask = bricksGraphic;
    rubberSprite.mask = rubberGraphic;
    waterSprite.mask = waterGraphic;
    
    app.stage.addChild(moving);
    app.stage.addChild(tilingMasks);

    let offsetX = 0;
    let offsetY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let scale = 1;
    app.ticker.add((delta) => {
        
        moving.position.set(offsetX + deltaX, offsetY + deltaY);
        moving.scale.set(scale, scale);
        tilingMasks.children.forEach((/** @type {import("pixi.js").TilingSprite} */sprite) => {
            sprite.tilePosition.set(offsetX + deltaX, offsetY + deltaY);
            sprite.tileScale.set(scale, scale);
        });
    });
    app.view.addEventListener("mousedown", (e) => {
        e.preventDefault();
        let dragOriginX = e.clientX;
        let dragOriginY = e.clientY;
        deltaX = 0;
        deltaY = 0;
        const onmove = (e) => {
            e.preventDefault();
            deltaX = (e.clientX - dragOriginX);
            deltaY = (e.clientY - dragOriginY);
        };
        const onup = (e) => {
            e.preventDefault();
            offsetX += deltaX;
            offsetY += deltaY;
            deltaX = 0;
            deltaY = 0;
            window.removeEventListener("mousemove", onmove);
            window.removeEventListener("mouseup", onup);
        };
        window.addEventListener("mousemove", onmove);
        window.addEventListener("mouseup", onup);
    });
    app.view.addEventListener("wheel", (e) => {
        e.preventDefault();
        if (e.ctrlKey) {
            if (e.deltaY) {
                const scaleDelta = 1.1 ** (-e.deltaY / 100);
                scale *= scaleDelta;
                const halfWidth = app.renderer.width * (1 - scaleDelta) / 2;
                offsetX = offsetX * scaleDelta + halfWidth;
                const halfHeight = app.renderer.height * (1 - scaleDelta) / 2;
                offsetY = offsetY * scaleDelta + halfHeight;
            }
        } else {
            if (e.deltaX) offsetX -= e.deltaX;
            if (e.deltaY) offsetY -= e.deltaY;
        }
    });
})();
