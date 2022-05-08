//@ts-check
(async () => {
    const {
        Buffer, Level, PIXI,
        Brick, Rubber, Water, BrickTriangle, RubberTriangle,
        Ring, RingBig, Bonus,
        VAccel, HAccel, Inverse,
        Spike, MovingPlat, MovingSpike, Roll,
        Bigger, Smaller,
        Blow, Suck,
        End
    } = await import("./index.js");
    globalThis.PIXI = PIXI;

    /** @type {Set<string>} */
    const textureFiles = new Set();
    /** @type {Record<string, import("pixi.js").Texture>} */
    const textures = {};

    const drawLevel = async (filename) => {
        const r = await fetch(filename);
        const ab = await r.arrayBuffer();
        const buffer = Buffer.from(ab);
        const level = Level.fromBinary(buffer, 0);
        console.log(level);
        const outBuffer = level.toBinary();
        console.log("in === out?", outBuffer.equals(buffer));
    
        const rect = [0, 0, 0, 0];
        for (let i = 0; i < level.objects.length; i++) {
            const obj = level.objects[i];

            /** @type {typeof import("./index").Brick} */
            // @ts-ignore
            const Ctor = obj.constructor;
            Ctor.TEXTURES.forEach(t => textureFiles.add(t));
            const { x1, y1 } = obj;
            if (x1 < rect[0]) rect[0] = x1;
            if (y1 < rect[1]) rect[1] = y1;
            if (obj instanceof Brick || obj instanceof Rubber) {
                const { x2, y2 } = obj;
                if (x2 > rect[2]) rect[2] = x2;
                if (y2 > rect[3]) rect[3] = y2;
            }
        }
        textureFiles.forEach((f) => {
            if (!textures[f]) textures[f] = PIXI.Texture.from(`../res/tex/${f}`)
        });
    
    
        const backgroundColor = 0xAADDEE;
    
        let app = new PIXI.Application({ width: rect[2] - rect[0] + 40, height: rect[3] - rect[1] + 40, antialias: false });
        globalThis.app = app;
        document.body.appendChild(app.view);
        app.renderer.backgroundColor = backgroundColor;
    
        const moving = new PIXI.Container();
        const smallObjects = new PIXI.Container();
        const tilingMasks = new PIXI.Container();
        const tilingGraphics = new PIXI.Container();
        moving.addChild(tilingGraphics);
        moving.addChild(smallObjects);
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
    
        await Promise.all(Object.values(textures).map((tex) => {
            return new Promise((resolve, reject) => {
                if (tex.valid) {
                    resolve();
                } else {
                    const onupdate = () => {
                        tex.off("update", onupdate);
                        resolve();
                    };
                    tex.on("update", onupdate);
                }
            });
        }))
        const negFilter = new PIXI.filters.ColorMatrixFilter();
        negFilter.negative(false);
    
        /**
         * @param {import("pixi.js").Renderer | import("pixi.js").AbstractRenderer} renderer 
         * @param {import("pixi.js").Texture} tex 
         * @param {import("pixi.js").Texture} maskTex 
         * @param {import("pixi.js").Filter} negFilter
         */
        const createMaskedTex = (renderer, tex, maskTex, negFilter) => {
            const maskRaw = new PIXI.Sprite(maskTex);
            maskRaw.filters = [negFilter];
            const maskNegTex = app.renderer.generateTexture(maskRaw);
            const sprite = new PIXI.Sprite(tex);
            const mask = new PIXI.Sprite(maskNegTex);
            sprite.mask = mask;
            return renderer.generateTexture(sprite);
        };
    
        const ringBigTex = createMaskedTex(app.renderer, textures[RingBig.TEXTURES[1]], textures[RingBig.TEXTURES[2]], negFilter);
        const ringTex = createMaskedTex(app.renderer, textures[Ring.TEXTURES[1]], textures[Ring.TEXTURES[2]], negFilter);
        const vAccelTex = createMaskedTex(app.renderer, textures[VAccel.TEXTURES[0]], textures[VAccel.TEXTURES[1]], negFilter);
        const hAccelTex = createMaskedTex(app.renderer, textures[HAccel.TEXTURES[0]], textures[HAccel.TEXTURES[1]], negFilter);
        const inverseTex = createMaskedTex(app.renderer, textures[Inverse.TEXTURES[0]], textures[Inverse.TEXTURES[1]], negFilter);
        const spikeTex = createMaskedTex(app.renderer, textures[Spike.TEXTURES[0]], textures[Spike.TEXTURES[1]], negFilter);
        const biggerTex = createMaskedTex(app.renderer, textures[Bigger.TEXTURES[0]], textures[Bigger.TEXTURES[1]], negFilter);
        const smallerTex = createMaskedTex(app.renderer, textures[Smaller.TEXTURES[0]], textures[Smaller.TEXTURES[1]], negFilter);
    
        const blowBaseSprite = new PIXI.Sprite(textures[Blow.TEXTURES[3]]);
        /** @type {import("pixi.js").RenderTexture[]} */
        const blowTexArray = [];
        for (let i = 0; i < 3; i++) {
            const container = new PIXI.Container();
            const sprite = new PIXI.Sprite(textures[Blow.TEXTURES[i]]);
            sprite.position.set(0, blowBaseSprite.height);
            container.addChild(blowBaseSprite);
            container.addChild(sprite);
            const tex = app.renderer.generateTexture(container);
            blowTexArray.push(tex);
        }
    
        const suckBaseSprite = new PIXI.Sprite(textures[Suck.TEXTURES[3]]);
        /** @type {import("pixi.js").RenderTexture[]} */
        const suckTexArray = [];
        for (let i = 0; i < 3; i++) {
            const container = new PIXI.Container();
            const sprite = new PIXI.Sprite(textures[Suck.TEXTURES[i]]);
            sprite.position.set(0, suckBaseSprite.height);
            container.addChild(suckBaseSprite);
            container.addChild(sprite);
            const tex = app.renderer.generateTexture(container);
            suckTexArray.push(tex);
        }
    
        await Promise.all([ringBigTex, ringTex, vAccelTex, hAccelTex, inverseTex, spikeTex, biggerTex, smallerTex, ...blowTexArray, ...suckTexArray].map((tex) => {
            return new Promise((resolve, reject) => {
                if (tex.valid) {
                    resolve();
                } else {
                    console.warn("waiting tex...");
                    const onupdate = () => {
                        tex.off("update", onupdate);
                        resolve();
                    };
                    tex.on("update", onupdate);
                }
            });
        }))
        for (let i = 0; i < level.objects.length; i++) {
            const obj = level.objects[i];
            if (obj instanceof Water) {
                const { x1, y1, x2, y2 } = obj;
                waterGraphic.drawRect(x1, y1, x2 - x1, y2 - y1);
            } else if (obj instanceof Rubber) {
                const { x1, y1, x2, y2 } = obj;
                rubberGraphic.drawRect(x1, y1, x2 - x1, y2 - y1);
            } else if (obj instanceof RubberTriangle) {
                const { x1, y1, facing, size } = obj;
                if (facing === RubberTriangle.FACING.leftBottom) rubberGraphic.drawPolygon(x1, y1, x1, y1 + size, x1 + size, y1 + size);
                if (facing === RubberTriangle.FACING.leftTop) rubberGraphic.drawPolygon(x1, y1, x1 + size, y1, x1, y1 + size);
                if (facing === RubberTriangle.FACING.rightBottom) rubberGraphic.drawPolygon(x1 + size, y1, x1 + size, y1 + size, x1, y1 + size);
                if (facing === RubberTriangle.FACING.rightTop) rubberGraphic.drawPolygon(x1, y1, x1 + size, y1, x1 + size, y1 + size);
            } else if (obj instanceof Brick) {
                const { x1, y1, x2, y2 } = obj;
                bricksGraphic.drawRect(x1, y1, x2 - x1, y2 - y1);
            } else if (obj instanceof BrickTriangle) {
                const { x1, y1, facing, size } = obj;
                if (facing === BrickTriangle.FACING.leftBottom) bricksGraphic.drawPolygon(x1, y1, x1, y1 + size, x1 + size, y1 + size);
                if (facing === BrickTriangle.FACING.leftTop) bricksGraphic.drawPolygon(x1, y1, x1 + size, y1, x1, y1 + size);
                if (facing === BrickTriangle.FACING.rightBottom) bricksGraphic.drawPolygon(x1 + size, y1, x1 + size, y1 + size, x1, y1 + size);
                if (facing === BrickTriangle.FACING.rightTop) bricksGraphic.drawPolygon(x1, y1, x1 + size, y1, x1 + size, y1 + size);
            } else if (obj instanceof RingBig) {
                const sprite = new PIXI.Sprite(ringBigTex);
                if (obj.variant === RingBig.VARIANT.vertical) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof Ring) {
                const sprite = new PIXI.Sprite(ringTex);
                if (obj.variant === Ring.VARIANT.vertical) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof Bonus) {
                const tex = textures[Bonus.TEXTURES[obj.variant === Bonus.VARIANT.life ? 4 : 0]];
                const sprite = new PIXI.Sprite(tex);
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof VAccel) {
                const sprite = new PIXI.Sprite(vAccelTex);
                if (obj.variant === VAccel.VARIANT.bottom) {
                    sprite.pivot.set(sprite.width, sprite.height);
                    sprite.rotation = Math.PI;
                } else if (obj.variant === VAccel.VARIANT.right) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                } else if (obj.variant === VAccel.VARIANT.left) {
                    sprite.pivot.set(sprite.width, 0);
                    sprite.rotation = -Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof HAccel) {
                const sprite = new PIXI.Sprite(hAccelTex);
                if (obj.variant === HAccel.VARIANT.bottom) {
                    sprite.pivot.set(sprite.width, sprite.height);
                    sprite.rotation = Math.PI;
                } else if (obj.variant === HAccel.VARIANT.right) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                } else if (obj.variant === HAccel.VARIANT.left) {
                    sprite.pivot.set(sprite.width, 0);
                    sprite.rotation = -Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof Inverse) {
                const sprite = new PIXI.Sprite(inverseTex);
                if (obj.variant === Inverse.VARIANT.bottom) {
                    sprite.pivot.set(sprite.width, sprite.height);
                    sprite.rotation = Math.PI;
                } else if (obj.variant === Inverse.VARIANT.right) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                } else if (obj.variant === Inverse.VARIANT.left) {
                    sprite.pivot.set(sprite.width, 0);
                    sprite.rotation = -Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof MovingPlat) {
                const sprite = new PIXI.Sprite(textures[MovingPlat.TEXTURES[0]]);
                sprite.position.set(...obj.initialPos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof MovingSpike) {
                const sprite = new PIXI.Sprite(textures[MovingSpike.TEXTURES[0]]);
                sprite.position.set(...obj.initialPos);
                sprite.interactive = true;
                sprite.buttonMode = true;
                sprite.on("click", () => console.log(obj));
                smallObjects.addChild(sprite);
            } else if (obj instanceof Spike) {
                const sprite = new PIXI.Sprite(spikeTex);
                if (obj.variant === Spike.VARIANT.bottom) {
                    sprite.pivot.set(sprite.width, sprite.height);
                    sprite.rotation = Math.PI;
                } else if (obj.variant === Spike.VARIANT.right) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                } else if (obj.variant === Spike.VARIANT.left) {
                    sprite.pivot.set(sprite.width, 0);
                    sprite.rotation = -Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof Roll) {
                const sprite = new PIXI.TilingSprite(textures[Roll.TEXTURES[0]], obj.length, 12);
                if (obj.variant === Roll.VARIANT.right) {
                    sprite.pivot.set(sprite.width / 2, sprite.height / 2);
                    sprite.rotation = Math.PI;
                    sprite.pivot.set(sprite.width, sprite.height);
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof Smaller) {
                const sprite = new PIXI.Sprite(smallerTex);
                if (obj.variant === Smaller.VARIANT.bottom) {
                    sprite.pivot.set(sprite.width, sprite.height);
                    sprite.rotation = Math.PI;
                } else if (obj.variant === Smaller.VARIANT.right) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                } else if (obj.variant === Smaller.VARIANT.left) {
                    sprite.pivot.set(sprite.width, 0);
                    sprite.rotation = -Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof Bigger) {
                const sprite = new PIXI.Sprite(biggerTex);
                if (obj.variant === Bigger.VARIANT.bottom) {
                    sprite.pivot.set(sprite.width, sprite.height);
                    sprite.rotation = Math.PI;
                } else if (obj.variant === Bigger.VARIANT.right) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                } else if (obj.variant === Bigger.VARIANT.left) {
                    sprite.pivot.set(sprite.width, 0);
                    sprite.rotation = -Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof Blow) {
                const sprite = new PIXI.AnimatedSprite(blowTexArray);
                if (obj.variant === Blow.VARIANT.top) {
                    sprite.pivot.set(sprite.width, sprite.height);
                    sprite.rotation = Math.PI;
                } else if (obj.variant === Blow.VARIANT.left) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                } else if (obj.variant === Blow.VARIANT.right) {
                    sprite.pivot.set(sprite.width, 0);
                    sprite.rotation = -Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof Suck) {
                const sprite = new PIXI.AnimatedSprite(suckTexArray);
                if (obj.variant === Suck.VARIANT.top) {
                    sprite.pivot.set(sprite.width, sprite.height);
                    sprite.rotation = Math.PI;
                } else if (obj.variant === Suck.VARIANT.left) {
                    sprite.pivot.set(0, sprite.height);
                    sprite.rotation = Math.PI / 2;
                } else if (obj.variant === Suck.VARIANT.right) {
                    sprite.pivot.set(sprite.width, 0);
                    sprite.rotation = -Math.PI / 2;
                }
                sprite.position.set(...obj.pos);
                smallObjects.addChild(sprite);
            } else if (obj instanceof End) {
                const cont = new PIXI.Container();
                const sprite = new PIXI.Sprite(textures[End.TEXTURES[0]]);
                const mask = new PIXI.Graphics();
                mask.beginFill();
                mask.drawRect(0, 0, sprite.width, 24);
                mask.endFill();
                sprite.mask = mask;
                cont.addChild(sprite);
                cont.addChild(mask);
                cont.position.set(...obj.pos);
                smallObjects.addChild(cont);
            }
        }
        bricksGraphic.endFill();
        rubberGraphic.endFill();
        waterGraphic.endFill();
        
        bricksSprite.mask = bricksGraphic;
        rubberSprite.mask = rubberGraphic;
        waterSprite.mask = waterGraphic;
        
        app.stage.addChild(tilingMasks);
        app.stage.addChild(moving);
    
        let offsetX = -rect[0] + 20;
        let offsetY = -rect[1] + 20;
        let deltaX = 0;
        let deltaY = 0;
        let scale = 1;
        app.ticker.add((delta) => {
            moving.position.set(offsetX + deltaX, offsetY + deltaY);
            moving.scale.set(scale, scale);
            // @ts-ignore
            tilingMasks.children.forEach((/** @type {import("pixi.js").TilingSprite} */sprite) => {
                sprite.tilePosition.set(offsetX + deltaX, offsetY + deltaY);
                sprite.tileScale.set(scale, scale);
            });
        });
        /*
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
        */
       return app;
    };
    /*
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
    */
    const level = +new URLSearchParams(location.search).get("level") || 21;
    drawLevel(`../res/levels/level.${level.toString().padStart(3, "0")}`);
    
})();
