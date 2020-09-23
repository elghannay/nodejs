#### working with numbers

> when working with numbers they get stored as DOUBLE since mongodb uses the same number size as js
> Every number is a 64bit float instead. So 12 and 12.0 are exactly the same number in JavaScript and therefore also in the Shell.

> if you want to insert a integer wrap it in **NumberInt("12")** with N and I capitalized, note that storing numbers as complete string won't let you do any arithmetic operations.
> also updates should be in the same format to avoid unpredictable behavior.

> always wrap numbers in quotation so you won't face the js shell limitations.**NumberLong("12")**

#### using high precision decimals

> doing subtract of 0.3 and 0.2 lead to some imprecise results , use **NumberDecimal("")**
