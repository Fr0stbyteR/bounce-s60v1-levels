# Bounce save file
### 00-12
```
12 5A 00 10 00 00 00 00 00 00 12 5A 00 10 00 4E 47 44 58
```
Head

### 13-16
```
58 00 00 00
```
Initial X: Int32

### 17-1A
```
68 00 00 00
```
Initial Y: Int32

### 1B-20

```
00 2C 00 00 00
```

### 20
```
00
```
Brick

### 21-22
```
00 00
```
Brick 1 (bottom) startX: Int16

### 23-24
```
8F 00
```
Brick 1 (bottom) startY: Int16

### 25-26
```
62 05
```
Brick 1 (bottom) endX: Int16

### 27-28
```
A8 00
```
Brick 1 (bottom) endY: Int16

## 29
```
00
```
Separator


### 2A-2B
```
00 00
```
Brick 2 (top) startX: Int16

### 2C-2D
```
00 00
```
Brick 2 (top) startY: Int16

### 2E-2F
```
30 05
```
Brick 2 (top) endX: Int16

### 30-31
```
19 00
```
Brick 2 (top) endY: Int16

### 32
```
00
```
Separator (Brick)

### 33-3A
Brick left

### 3B
Separator

### 3C-43
Brick right 1 above ring

### 44-45
```
02 01
```
RING mark (24x16)
01 = vertical
00 = horizontal

### 46-49
Ring 1 XY: Int16 + Int16

### 5C-5D
```
04 00
```
Spike mark (8x16)
00=up
01=right
02=bottom
03=left

### DD-DE
```
0E 00
```
Savepoints (16x16)

### 104-105
```
0E 01
```
Lives (16x16)

### 140
```
0B
```
Bouncing Brick 4*Int16

### 16D
```
09
```
End port (16x22)

### 176-178
```
50
```

### 179-18C
Comments

### 18D
```
28
```

### 18E-197
asset mbm

### 198-19A
```
FF FF FF
```

```
13 01
```
BIGRING mark
01 = vertical
00 = horizontal

### moving spikes

```
03
```
startYX: Int16 + Int16
XY speed (px/frame): Int16 + Int16
back time (frame): Int16

Int16*3

### brick_tri
```
01
```

startYX: Int16 + Int16
size: Int16
variant: Uint8: 0=left/top 3=left/bottom

### blow

```
0D
```
startYX: Int16 + Int16
variant: Uint8: 0=bottom 1=left 2=top 3=right
