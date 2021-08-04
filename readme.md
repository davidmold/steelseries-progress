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
import { waitfor } from 'lantix-utils'

async function main() {
  await init()
  console.log('starting')
  for(let i = 0; i <= 100; i++){
    await setProgress(i)
    await waitfor(100)
  }
}

main().then(() => {
  console.log('done')
})
```
Hopefully you get the idea.