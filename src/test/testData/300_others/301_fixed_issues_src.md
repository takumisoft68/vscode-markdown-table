# Fixed issues

# No.3

|EN|DE|
|------|------|
|Apple|Apfel|
|Apples|Äpfel|
|Banana|Banane|

# No.4 Keep indentation

   | column A | column B | column C |
   | :--- | :-- | :-- |
   | data | data | data |
   | data |||

# No.20

|||
|---|---|
|Gyakorlatvezető|XYZ|
|GyakorlatvezetőGyakorlatvezető|XYZ|
|Tanuló|XYZ|

# No.22 Emoji

|C1|C2|C3|
|---|---|---|
|🧪|Sometext||
|Anotherrow|Moretext||

# No.36 Strange behavior in tables containing escape

| Command | Description |
| :-----: | :---------- |
|  `\\` | Line breaks |
| `\emph` | Emphasis    |

# No.57 Skip code block

        |columnA|columnB\|`|`||columnC|`\\`|columnD||
        |:-------|:--------------|:-----|:-------------|:---|----------:|---|
        |dataA1|dataB1||dataC1||\|dataD1||
        |dataA2|dataB2`\\`|`\A\\`|\`\\``dataC2||`|`dataD2||
        |dataA3|dataB3||dataC3||`|`dataD3||
        |dataA4|dataB4||dataC4||`data|D4`||


    |columnA|columnB|columnC|columnD|
    |:--|:--:|--:|:--|
    |dataA1|dataB1|dataC1|dataD1|
    |dataA2dataA2|dataB2|dataC2|dataD2|
    |dataA3|dataB3dataB3|dataC3|dataD3|
    |dataA4|dataB4|dataC4|dataD4|

```md
        | column A | column B \| `|` |        | column C       | `\\` |    column D |     |
        | :------- | :-------------- | :----- | :------------- | :--- | ----------: | --- |
        | data A1  | data B1         |        | data C1        |      |  \| data D1 |     |
        | data A2  | data B2 `\\`    | `\A\\` | \`\\`` data C2 |      |  `|`data D2 |     |
        | data A3  | data B3         |        | data C3        |      | `|` data D3 |     |
        | data A4  | data B4         |        | data C4        |      |  `data| D4` |     |


    | column A | column B | column C | column D |
    | :-- | :--: | --: | :-- |
    | data A1 | data B1 | data C1 | data D1 |
    | data A2 data A2 | data B2  | data C2  | data D2  |
    | data A3  | data B3 data B3 | data C3  | data D3  |
    | data A4  | data B4  | data C4  | data D4  |
```

        |columnA|columnB\|`|`||columnC|`\\`|columnD||
        |:-------|:--------------|:-----|:-------------|:---|----------:|---|
        |dataA1|dataB1||dataC1||\|dataD1||
        |dataA2|dataB2`\\`|`\A\\`|\`\\``dataC2||`|`dataD2||
        |dataA3|dataB3||dataC3||`|`dataD3||
        |dataA4|dataB4||dataC4||`data|D4`||


    |columnA|columnB|columnC|columnD|
    |:--|:--:|--:|:--|
    |dataA1|dataB1|dataC1|dataD1|
    |dataA2dataA2|dataB2|dataC2|dataD2|
    |dataA3|dataB3dataB3|dataC3|dataD3|
    |dataA4|dataB4|dataC4|dataD4|
