# ⚡ App Building Crash Course


## App Layout & View
### Change the Fav Icon and browser title
* Go to `public/index.html`
* Change Fav icon using `<link rel="icon">...</link>` tag
* Change Title using `<title>...</title>` tag

### Change the App theme color 
* Pick a suitable App base theme color from https://colorbrewer2.org/#type=sequential&scheme=PuBu&n=9
* Open the file `src/app/Theme.js`
* Change the color from `#084081` to your selected App theme base color

### Change App Icon and Title
* Reference for emojis: https://emojipedia.org/
* Reference for icons: https://fonts.google.com/icons?selected=Material+Icons
* Open the file `src/common/Header/index.js`
* Change App Header Icon + Title at line 56-58
```
<Typography className={classes.appTitle} >
    ⚡ App Building Crash Course
</Typography>
```
## References for Components
* MUI Components: https://v4.mui.com/components/lists/

## 🎉 [Tutorial] Style Transfer

### Create a new React Component

### Add App Route to access the new Component

### Create states to hold data in Component
* Add the following states
```
const [numImages, setNumImages] = useState(12);
const [contentImages, setContentImages] = useState([]);
const [styleImages, setStyleImages] = useState([]);
const [selectedContentImage, setSelectedContentImage] = useState(null);
const [selectedStyleImage, setSelectedStyleImage] = useState(null);
const [prediction, setPrediction] = useState(null);
```







