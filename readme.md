# steelseries-progress

Perhaps you are a coder who owns a steelseries keyboard. Maybe it would be nice if you could
notify it of your code's progress so that it could display it on its oled. If so, then
this simple app is for you, or you can use it as a jumping off point to explore more
easy coding of the behavior of your steelseries goods.

## Installation
```
npm install steelseries-progress
```

## Usage

```
import { init, setProgress } from 'steelseries-progress'

async function main() {
  if(init()) {
    let success = await setProgress(10)
  }
}
```
Hopefully you get the idea.