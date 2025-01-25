/* global React ReactDOM */
import { sfConn, apiVersion } from "./verstander.js";
import { getAllFieldSetupLinks } from "./setup-links.js";

let h = React.createElement;

{
    parent.postMessage({ insextInitRequest: true }, "*");
    addEventListener("message", function initResponseHandler(e) {
        if (e.source == parent && e.data.insextInitResponse) {
            removeEventListener("message", initResponseHandler);
            init(e.data);
        }
    });
}

function closePopup() {
    parent.postMessage({ insextClosePopup: true }, "*");
}

function init({ sfHost, inDevConsole, inLightning, inVerstander }) {
    let addonVersion = chrome.runtime.getManifest().version
    sfConn.getSession(sfHost).then(() => {

        ReactDOM.render(h(App, {
            sfHost,
            inDevConsole,
            inLightning,
            inVerstander,
            addonVersion,
        }), document.getElementById("root"));

    });
}

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isInSetup: false,
            contextUrl: null
        };
        this.onContextUrlMessage = this.onContextUrlMessage.bind(this);
        this.onShortcutKey = this.onShortcutKey.bind(this);
    }
    onContextUrlMessage(e) {
        if (e.source == parent && e.data.insextUpdateRecordId) {
            let { locationHref } = e.data;
            this.setState({
                isInSetup: locationHref.includes("/lightning/setup/"),
                contextUrl: locationHref
            });
        }
    }

    onShortcutKey(e) {
        if (e.key == "m") {
            e.preventDefault();
            this.refs.showAllDataBox.clickShowDetailsBtn();
        }
        if (e.key == "a") {
            e.preventDefault();
            this.refs.showAllDataBox.clickAllDataBtn();
        }
        if (e.key == "e") {
            e.preventDefault();
            this.refs.dataExportBtn.click();
        }
        if (e.key == "i") {
            e.preventDefault();
            this.refs.dataImportBtn.click();
        }
        if (e.key == "l") {
            e.preventDefault();
            this.refs.limitsBtn.click();
        }
        if (e.key == "d") {
            e.preventDefault();
            this.refs.metaRetrieveBtn.click();
        }
        if (e.key == "x") {
            e.preventDefault();
            this.refs.apiExploreBtn.click();
        }
        if (e.key == "h" && this.refs.homeBtn) {
            this.refs.homeBtn.click();
        }
        //TODO: Add shortcut for "u to go to user aspect"
    }
    componentDidMount() {
        addEventListener("message", this.onContextUrlMessage);
        addEventListener("keydown", this.onShortcutKey);
        parent.postMessage({ insextLoaded: true }, "*");
    }
    componentWillUnmount() {
        removeEventListener("message", this.onContextUrlMessage);
        removeEventListener("keydown", this.onShortcutKey);
    }
    render() {
        let {
            sfHost,
            inDevConsole,
            inLightning,
            inVerstander,
            addonVersion,
        } = this.props;
        let { isInSetup, contextUrl } = this.state;
        let hostArg = new URLSearchParams();
        hostArg.set("host", sfHost);
        let linkTarget = inDevConsole ? "_blank" : "_top";
        return (
            h("div", {},
                h("div", { className: "header" },
                    h("div", { className: "header-icon" },
                        h("svg", { viewBox: "0 0 24 24" },
                            h(
                                "g",
                                { transform: "scale(0.0012)" },
                                // 1) White background rectangle
                                h("path", {
                                    d: "M 20005,5 H 5 V 20005 H 20005 V 5",
                                    fill: "#ffffff",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 2) Rectangle border
                                h("path", {
                                    d: "M 20005,5 H 5 v 20000 h 20000 z",
                                    fill: "none",
                                    stroke: "#000000",
                                    strokeWidth: "10",
                                    strokeLinecap: "butt",
                                    strokeLinejoin: "miter",
                                    strokeMiterlimit: "10",
                                    strokeDasharray: "none",
                                    strokeOpacity: "1",
                                }),
                                // 3)
                                h("path", {
                                    d: "m 7777.3,7587.9 c -110.12,90.8 -215.45,187.2 -315.35,288.4 -21.97,22.5 -43.52,45.1 -65.06,67.7 -361.05,383.3 -643.09,827.7 -839.17,1321.9 -207.62,523.6 -306.64,1072.6 -294.13,1631.4 6.1,268.8 38.52,538.3 96.41,801.2 57.02,260.5 139.94,516.7 245.7,761.9 105.77,245 235.91,481 386.18,701.2 151.8,222.4 326.01,430.9 517.19,619.4 102.39,100.9 209.25,195.8 320.56,284.8 64.21,51.2 129.5,100.4 196.41,147.6 -1.08,1.5 -2.28,3.2 -3.47,4.7 -33.31,43.8 -66.28,87.1 -99.03,129.7 -0.32,0.4 -0.54,0.8 -0.86,1.1 -18.07,23.4 -36.02,46.7 -53.87,69.7 -25.89,33.5 -51.57,66.4 -77.14,99 -10.23,13.1 -20.58,26.2 -30.69,39.1 -0.44,0.7 -0.98,1.2 -1.53,1.9 -10.77,13.6 -21.43,27.2 -31.98,40.6 -32,40.3 -63.56,80.1 -94.68,119 -10.33,13 -20.67,25.9 -31.01,38.6 -20.56,25.7 -41.02,51 -61.15,75.9 -20.13,24.9 -40.16,49.5 -59.96,73.6 -14.8,18.2 -29.48,36.2 -44.06,53.9 -4.79,5.9 -9.69,11.8 -14.48,17.6 -9.58,11.8 -19.15,23.4 -28.73,35 -9.46,11.5 -18.93,22.9 -28.4,34.2 -9.35,11.4 -18.71,22.6 -27.96,33.8 -22.31,26.9 -44.18,53.1 -65.61,78.8 -9.69,11.6 -19.37,23 -28.95,34.3 -6.09,7.2 -12.08,14.4 -18.17,21.6 -188.47,223.7 -340.26,396.1 -432.43,499.1 -62.67,70.3 -97.82,108.5 -97.82,108.5 0,0 -198.69,-178.2 -504.02,-476.1 -1003.48,-978.6 -3162.67,-3248.4 -3231.98,-4723.9 -69.2,-1489.1 805.01,-2803.9 2095.86,-3364.3 0.22,-0.1 0.33,-0.2 0.43,-0.2 116.54,-50.6 236.46,-95 359.31,-132.8 45.69,-14.3 91.94,-27.6 139.05,-39.2 233.41,-61.7 476.5,-99.6 727.53,-111.6 642.88,-30 1253.31,116 1784.65,395.6 -98.91,68.1 -194.99,140.8 -287.59,217.3",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 4)
                                h("path", {
                                    d: "m 6570.3,7618.3 c -38.35,9.5 -75.98,20.3 -113.18,31.9 -99.98,30.8 -197.56,66.9 -292.41,108.1 -0.09,0 -0.18,0.1 -0.35,0.2 -1050.56,456.1 -1762.03,1526.1 -1705.7,2738 56.4,1200.8 -574.11,1200.8 -630.53,0 -56.31,-1211.9 655.15,-2281.9 1705.7,-2738 0.18,-0.1 0.27,-0.2 0.36,-0.2 94.84,-41.2 192.44,-77.3 292.42,-108.1 37.19,-11.6 74.83,-22.4 113.17,-31.9 189.96,-50.2 387.79,-81 592.1,-90.8 152.68,-7.1 303.09,-1.9 450.33,14.5 -140.85,15.5 -278.37,41 -411.91,76.3",
                                    fill: "#ffffff",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 5)
                                h("path", {
                                    d: "m 13321.8,10779.2 c -0.1,-6.8 -0.2,-13.4 -0.3,-20.1 0,-2 0,-3.9 -0.1,-5.9 -0.2,-11.2 -0.5,-22.4 -0.9,-33.6 v -1.4 c -0.3,-11 -0.8,-22.1 -1.2,-33.1 -29.7,-682.6 -305.3,-1335.9 -772.2,-1833.9 -7.5,-8 -15.2,-16 -22.8,-23.9 -11,-11.5 -22.2,-23 -33.5,-34.3 -9.4,-9.4 -18.8,-18.9 -28.5,-28.3 -8.2,-8 -16.3,-16 -24.6,-23.7 -16.4,-15.9 -33.2,-31.4 -50.1,-46.7 -8,-7.5 -16.2,-14.8 -24.3,-21.8 -0.4,-0.4 -0.8,-0.7 -1.1,-1 -17,-15.4 -34.3,-30.3 -51.7,-44.8 -13.1,-11.1 -26.2,-22 -39.5,-32.8 -9.9,-8.2 -19.9,-16.1 -30,-24.2 -30.2,-24 -60.9,-47.3 -92.1,-69.9 -18.5,-13.6 -37.1,-26.9 -55.9,-39.8 -5.6,-4 -11,-7.7 -16.6,-11.4 -6.6,-4.6 -13.2,-9.1 -20,-13.6 -4.7,-3.1 -9.3,-6.2 -14.1,-9.3 -27.2,-18.1 -54.9,-35.6 -82.9,-52.8 -9.8,-6 -19.7,-12 -29.5,-17.8 -8.7,-5.3 -17.3,-10.4 -26,-15.4 -60.8,-35.1 -123,-68.3 -187.1,-99.3 -29,-14.1 -58.4,-27.8 -88.1,-40.9 -35.1,-15.6 -70.9,-30.5 -106.8,-44.9 -4.1,-1.6 -8.2,-3.2 -12.4,-4.8 -178.1,-69.7 -359.3,-120.1 -541,-152.6 l -2,-0.4 c -20.4,-3.5 -40.9,-7 -61.5,-10.2 -10.3,-1.6 -20.6,-3.1 -30.8,-4.6 -5.6,-0.7 -11,-1.5 -16.5,-2.2 -8,-1.1 -16.1,-2.2 -24.1,-3.2 -13.3,-1.7 -26.5,-3.3 -39.8,-4.8 -8.2,-1 -16.5,-1.8 -24.8,-2.7 -6.1,-0.7 -12.1,-1.2 -18.1,-1.9 -56.8,-5.6 -113.6,-9.4 -170.3,-11.5 -22.7,-0.9 -45.4,-1.4 -68.2,-1.7 -14.1,-0.3 -28,-0.4 -42,-0.4 -9.5,0 -18.9,0 -28.3,0.3 -8,0 -15.9,0.2 -23.9,0.3 -0.4,-0.1 -0.7,-0.1 -1.2,0 -8.8,0.1 -17.6,0.3 -26.4,0.6 -8.8,0.3 -17.6,0.6 -26.5,0.9 -173.4,6.8 -344.9,29.4 -512.47,67.1 -87.69,19.5 -174.42,43.4 -259.73,71.1 -54.08,17.5 -107.62,36.7 -160.5,57.5 -70.29,27.5 -139.39,57.7 -207.29,90.7 -21,10.1 -41.79,20.6 -62.46,31.2 -122.52,63.3 -240.59,135.3 -353.1,215.8 -79.87,57 -157.02,118.4 -230.9,183.9 -39.94,35.3 -78.89,71.7 -116.87,109.3 -12.62,12.6 -25.24,25.2 -37.65,38 -8.37,8.6 -16.64,17.2 -24.92,26 -1.3,1.4 -2.5,2.5 -3.69,3.9 -7.29,7.7 -14.59,15.5 -21.88,23.5 -0.97,1 -2.06,2.1 -3.04,3.2 -8.16,8.9 -16.22,17.9 -24.27,26.8 -6.75,7.4 -13.27,14.9 -19.8,22.4 -18.83,21.4 -37.32,43.2 -55.5,65.2 -14.25,17.2 -28.29,34.6 -42.11,52.1 -7.4,9.5 -14.69,18.9 -21.98,28.5 -6.42,8.3 -12.73,16.7 -19.04,25 -0.87,1.2 -1.85,2.5 -2.72,3.7 -5.01,6.7 -9.9,13.3 -14.8,20.1 -13.06,17.7 -25.79,35.5 -38.3,53.5 -7.4,10.6 -14.69,21.2 -21.98,31.9 -7.29,10.8 -14.58,21.6 -21.76,32.6 -5.23,8 -10.45,16 -15.57,24 -0.32,0.3 -0.54,0.6 -0.65,1.1 -5.98,9.2 -11.75,18.3 -17.63,27.7 -10.55,16.9 -20.89,33.8 -31.12,50.9 -8.38,14.2 -16.75,28.4 -24.91,42.8 -0.55,0.9 -1.09,1.8 -1.63,2.8 -6.65,11.7 -13.28,23.4 -19.81,35.3 -0.22,0.3 -0.43,0.6 -0.65,1.1 -0.33,0.3 -0.44,0.6 -0.55,1 -46.79,84.8 -89.77,172.7 -128.4,263.7 -8.92,21.3 -17.85,42.9 -26.44,64.6 -72.47,182.4 -124.48,367.8 -157.56,553.9 -1.09,6.5 -2.18,13.1 -3.38,19.6 -2.72,16.7 -5.54,33.4 -8.04,50.3 -3.05,20.4 -6.1,40.9 -8.71,61.3 -0.87,7.3 -1.86,14.6 -2.72,21.9 -0.11,1 -0.22,1.9 -0.33,2.7 -1.09,8.3 -1.96,16.5 -2.82,24.7 -0.44,3.5 -0.77,7 -1.21,10.5 -1.41,12.9 -2.71,25.9 -3.91,38.8 -0.11,0.9 -0.22,1.9 -0.22,2.8 -0.98,10.6 -1.85,21.2 -2.72,31.8 -0.87,10.9 -1.74,21.9 -2.5,32.9 -0.76,11 -1.42,21.9 -2.07,32.8 -0.66,11 -1.2,21.9 -1.74,32.9 -0.55,11 -0.98,21.9 -1.3,32.9 -0.44,11.6 -0.88,23.4 -0.98,35.1 -0.66,30.7 -0.88,61.3 -0.66,92 0.22,18.8 0.66,37.5 1.2,56.1 16.97,571.1 206.2,1123.3 535.91,1583.1 48.63,67.8 100.32,133.5 154.84,197.1 9.14,10.5 18.28,21.1 27.52,31.5 9.36,10.5 18.61,20.9 28.08,31.3 0.22,0.2 0.54,0.5 0.76,0.9 11.97,13 24.04,26.1 36.34,38.9 13.28,14 26.66,28 40.26,41.7 11.32,11.4 22.64,22.7 34.07,33.9 2.06,2.2 4.24,4.3 6.42,6.2 8.92,8.7 17.95,17.4 27.09,25.9 2.39,2.5 4.89,4.8 7.29,6.9 10.99,10.4 22.09,20.8 33.4,31 9.69,8.9 19.48,17.6 29.28,26.3 5.87,5.3 11.85,10.5 17.84,15.6 19.26,16.9 38.74,33.3 58.43,49.6 8.38,6.9 16.76,13.7 25.25,20.5 8.81,7.3 17.74,14.3 26.77,21.3 9.03,7.1 17.95,14.1 27.09,21 5.55,4.4 11.21,8.7 16.87,12.8 10.77,8.2 21.55,16.2 32.53,24.3 4.79,3.5 9.47,7 14.26,10.2 7.51,5.6 15.12,11 22.85,16.5 1.41,0.9 2.72,1.9 4.13,2.9 13.82,9.8 27.75,19.5 41.79,28.9 14.15,9.6 28.29,19 42.54,28.3 10.13,6.7 20.35,13.2 30.69,19.8 9.25,5.9 18.61,11.8 27.97,17.6 9.24,5.7 18.71,11.4 28.07,17.2 0.76,0.4 1.52,0.8 2.28,1.4 131.45,78.7 270.95,148.1 417.96,206.4 17.84,7.1 35.69,13.9 53.53,20.6 165.4,61.8 333.19,107.2 501.31,137.2 12.4,2.1 24.91,4.2 37.47,6.3 16.5,2.8 33,5.3 49.7,7.6 8.3,1.2 16.5,2.4 24.9,3.5 33,4.5 66.2,8.4 99.5,11.7 8.2,0.9 16.5,1.7 24.8,2.4 13.4,1.2 26.8,2.4 40.2,3.4 0.6,0 1.1,0 1.8,0.1 11.6,0.9 23.4,1.7 35.1,2.4 12.1,0.9 24.2,1.5 36.4,2.1 12.1,0.6 24.3,1.2 36.5,1.6 12.2,0.5 24.4,0.9 36.7,1.1 9.9,0.3 19.9,0.5 29.8,0.6 14.6,0.3 29.2,0.4 43.8,0.4 10.8,0 21.6,-0.1 32.5,-0.3 12,-0.1 23.8,-0.4 35.7,-0.6 h 0.1 c 357.7,-9 708.1,-85.6 1033.5,-222 212.9,-89.3 415,-204.2 601.4,-342.6 67.5,-50.1 132.8,-103.2 195.9,-159.3 8.6,-7.8 17.2,-15.5 25.8,-23.3 3.4,-3.1 6.9,-6.3 10.4,-9.6 8.7,-8.1 17.4,-16.1 26,-24.3 10.3,-9.7 20.5,-19.4 30.6,-29.3 3.1,-2.9 6.2,-5.9 9.2,-9.1 8.2,-7.9 16.4,-16 24.4,-24.2 6.1,-6 12.1,-12.1 18,-18.3 15,-15.3 29.7,-30.7 44,-46.3 8,-8.2 15.7,-16.6 23.2,-25.1 23.2,-25.3 45.7,-50.9 67.7,-77.2 7.6,-8.7 14.9,-17.5 22,-26.3 14.7,-17.6 29,-35.4 42.9,-53.3 19.6,-24.7 38.7,-49.8 57.2,-75.3 2.2,-2.8 4.2,-5.8 6.4,-8.7 5.6,-7.5 11,-15.1 16.3,-22.8 2.2,-2.9 4.3,-5.9 6.4,-9 5.3,-7.3 10.5,-14.7 15.5,-22.1 9.7,-13.9 19.1,-27.8 28.5,-42 7.6,-11.3 15.1,-22.7 22.4,-34.3 0.8,-0.8 1.4,-1.8 1.9,-2.8 6.2,-9.6 12.3,-19.1 18.3,-28.8 90.5,-144.5 169.2,-299.3 234.2,-463.2 63,-158.8 110.7,-320 143.9,-481.9 2.3,-11.4 4.5,-22.7 6.7,-34.1 2.3,-11.9 4.5,-23.7 6.5,-35.5 1.4,-7.4 2.6,-14.8 3.9,-22.3 2.6,-15.6 5.2,-31.2 7.6,-46.9 3.1,-21.2 6.3,-42.3 9,-63.7 3.5,-26.5 6.5,-53.3 9.3,-80.3 1,-10.4 2,-20.9 2.9,-31.3 1,-10.2 1.8,-20.5 2.6,-30.8 0.3,-3.8 0.6,-7.6 0.9,-11.5 0.7,-9.3 1.4,-18.6 1.9,-27.9 0,-1.4 0.1,-2.9 0.3,-4.3 0.7,-11.5 1.4,-22.9 1.9,-34.3 0.7,-11.1 1.1,-22.3 1.5,-33.4 0,-1.5 0.1,-3.1 0.1,-4.6 1,-22.7 1.6,-45.6 1.8,-68.3 0.2,-13.5 0.3,-26.9 0.3,-40.4 0,-8.6 0,-17.3 -0.1,-25.9 z m 711.6,1439.4 c -190.8,480.8 -470.1,910 -830.4,1275.9 -173.1,175.7 -364.5,335.6 -568.8,475 -109.2,74.5 -222.8,143.9 -339.7,207 -99.1,53.5 -200.7,102.8 -304.1,147.5 -100.3,43.2 -202.3,82.3 -306,117 -116,38.6 -234.1,72 -353.1,99.7 -13.4,3 -27,6.2 -40.4,9 -241.7,53.2 -489.1,82.9 -735.8,88.6 -78.2,1.7 -156.5,0.9 -234.5,-2 -432.08,-16.6 -856.23,-106.5 -1263.52,-268.2 -60.39,-24 -119.8,-49.2 -178.46,-75.9 -194.12,-88.3 -378.88,-191.7 -553.96,-309.6 -13.17,-9 -26.23,-17.9 -39.28,-26.9 -14.8,-10.3 -29.5,-20.6 -44.07,-31.1 -56.37,-40.2 -111.54,-82 -165.83,-125.3 -102.18,-81.7 -200.33,-168.9 -294.35,-261.5 -175.62,-173.1 -335.57,-364.5 -474.96,-568.7 -137.98,-202.3 -257.46,-419 -354.63,-643.9 -97.06,-225.2 -173.23,-460.5 -225.57,-699.6 -53.21,-241.5 -82.91,-489 -88.57,-735.7 -11.43,-513.2 79.43,-1017.3 270.07,-1498.2 180.09,-453.8 439.06,-861.9 770.62,-1213.8 19.8,-20.8 39.61,-41.6 59.74,-62.1 91.73,-93 188.46,-181.5 289.55,-264.9 89.77,-74.2 183.13,-144.4 279.22,-210.1 32.64,-22.3 65.72,-44.1 99.02,-65.2 150.48,-96.1 308.15,-181.9 470.5,-256.1 24.71,-11.4 49.51,-22.4 74.43,-33.2 171.71,-74.1 349.73,-136 530.91,-184.6 55.82,-14.9 112.18,-28.7 168.43,-41.1 241.68,-53.2 489.21,-82.9 735.91,-88.3 157.2,-3.7 313.5,2.5 468.8,18 220.6,22.3 438.9,63.9 653.2,124.5 126.7,35.9 252.1,78.3 376.1,127.5 295.3,117 571,267.8 824.6,450 l 201.4,-197.7 842.7,842.7 -196.7,193.2 c 24.9,33.8 49.4,68.1 73.2,102.6 1.9,2.7 3.7,5.4 5.5,8.3 138.1,202.1 257.5,418.8 354.8,643.8 97,225.1 173.1,460.4 225.6,699.6 3,13.7 5.9,27.3 8.6,41.1 11.5,54.4 21.8,108.9 30.7,163.9 28.8,175.6 45.1,353.4 49.1,530.6 11.7,513.3 -79.2,1017.3 -270,1498.2",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 6)
                                h("path", {
                                    d: "m 13305.4,7691.7 -299.3,-299.4 c -80.4,-80.4 -89.5,-205 -27.3,-295.4 7.9,-11.5 17.1,-22.5 27.3,-32.8 l 2809.2,-2809.3 c 10.2,-10.2 21.2,-19.4 32.8,-27.2 90.4,-62.2 215,-53.1 295.4,27.2 l 299.4,299.3 19.4,19.5 -3131,3143.8 -25.9,-25.7",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 7)
                                h("path", {
                                    d: "m 13392.8,7778.9 3131,-3143.8 290.8,290.8 -3137.5,3137.5 -284.3,-284.5",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 8)
                                h("path", {
                                    d: "m 16987.8,5427.2 -2809.4,2809.4 c -90.5,90.5 -237.5,90.5 -328,0 l -19.4,-19.4 3137.4,-3137.4 19.4,19.4 c 90.6,90.5 90.6,237.4 0,328",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 9)
                                h("path", {
                                    d: "m 12895.4,10580.9 c -13.5,-76.1 -30.7,-150.8 -50.8,-223.9 106.2,1256.2 -760.9,2408.9 -2026.6,2634.2 -1265.6,225.3 -2477.22,-557.4 -2811.21,-1773 6.37,75.5 16.13,151.5 29.69,227.7 114.96,645.7 471.41,1187.9 959.82,1549.9 536.19,360.3 1207.3,521.1 1893.5,399 687.4,-122.4 1262.6,-506 1641.5,-1030.7 332.2,-507.9 478.9,-1138.6 364.1,-1783.2",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 10)
                                h("path", {
                                    d: "m 9470.06,9008.1 c -51.36,0 -102.92,18.1 -144.36,54.9 -89.9,79.7 -98.12,217.3 -18.34,307.2 l 1948.04,2195.4 c 79.7,89.9 217.3,98.1 307.2,18.4 89.9,-79.8 98.1,-217.4 18.3,-307.3 L 9632.92,9081.3 c -42.99,-48.4 -102.79,-73.2 -162.86,-73.2",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 11)
                                h("path", {
                                    d: "m 11366,9100.9 c -51.4,0 -102.9,18.1 -144.4,54.9 -89.9,79.7 -98.1,217.3 -18.3,307.2 l 550,619.8 c 79.8,89.9 217.3,98.1 307.2,18.4 89.9,-79.8 98.1,-217.4 18.3,-307.3 l -550,-619.8 c -43,-48.5 -102.7,-73.2 -162.8,-73.2",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 12)
                                h("path", {
                                    d: "m 9730.79,11179 c -51.37,0 -102.92,18.1 -144.37,54.8 -89.9,79.8 -98.11,217.4 -18.34,307.3 l 852.42,960.7 c 79.8,89.9 217.4,98.1 307.3,18.3 89.9,-79.7 98.1,-217.3 18.3,-307.2 l -852.45,-960.7 c -43,-48.5 -102.8,-73.2 -162.86,-73.2",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                }),
                                // 13)
                                h("path", {
                                    d: "m 8730.8,10052 c -51.37,0 -102.92,18.1 -144.37,54.8 -89.9,79.8 -98.11,217.4 -18.34,307.3 l 436.83,492.3 c 79.77,89.9 217.31,98.1 307.22,18.3 89.91,-79.8 98.12,-217.3 18.34,-307.2 l -436.82,-492.3 c -43,-48.5 -102.8,-73.2 -162.86,-73.2",
                                    fill: "#000000",
                                    fillOpacity: "1",
                                    fillRule: "nonzero",
                                    stroke: "none",
                                })
                            )
                        )
                    ),
                    "Salesforce Verstander"
                ),
                h("div", { className: "main" },
                    h(AllDataBox, { ref: "showAllDataBox", sfHost, showDetailsSupported: !inLightning && !inVerstander, linkTarget, contextUrl }),
                    h("div", { className: "global-box" },
                        h("a", { ref: "treeQueryBtn", href: "tree-query.html?" + hostArg, target: linkTarget, className: "button" }, h("u", {}, "T"), "reeQuery"),
                        // h("a", { ref: "dataExportBtn", href: "data-export.html?" + hostArg, target: linkTarget, className: "button" }, "Data ", h("u", {}, "E"), "xport"),
                        // h("a", { ref: "dataImportBtn", href: "data-import.html?" + hostArg, target: linkTarget, className: "button" }, "Data ", h("u", {}, "I"), "mport"),
                        // h("a", { ref: "limitsBtn", href: "limits.html?" + hostArg, target: linkTarget, className: "button" }, "Org ", h("u", {}, "L"), "imits"),
                        // // Advanded features should be put below this line, and the layout adjusted so they are below the fold
                        // h("a", { ref: "metaRetrieveBtn", href: "metadata-retrieve.html?" + hostArg, target: linkTarget, className: "button" }, h("u", {}, "D"), "ownload Metadata"),
                        // h("a", { ref: "apiExploreBtn", href: "explore-api.html?" + hostArg, target: linkTarget, className: "button" }, "E", h("u", {}, "x"), "plore API"),
                        // // Workaround for in Lightning the link to Setup always opens a new tab, and the link back cannot open a new tab.
                        // inLightning && isInSetup && h("a", { ref: "homeBtn", href: `https://${sfHost}/lightning/page/home`, title: "You can choose if you want to open in a new tab or not", target: linkTarget, className: "button" }, "Salesforce ", h("u", {}, "H"), "ome"),
                        // inLightning && !isInSetup && h("a", { ref: "homeBtn", href: `https://${sfHost}/lightning/setup/SetupOneHome/home?setupApp=all`, title: "You can choose if you want to open in a new tab or not", target: linkTarget, className: "button" }, "Setup ", h("u", {}, "H"), "ome"),
                    )
                ),
                h("div", { className: "footer" },
                    h("div", { className: "meta" },
                        h("div", { className: "version" },
                            "(",
                            h("a", { href: "https://github.com/sorenkrabbe/Chrome-Salesforce-inspector/blob/master/CHANGES.md" }, "v" + addonVersion),
                            " / " + apiVersion + ")",
                        ),
                        h("div", { className: "tip" }, "[ctrl+alt+i] to open"),
                        h("a", { className: "about", href: "https://github.com/sorenkrabbe/Chrome-Salesforce-inspector", target: linkTarget }, "About")
                    ),
                )
            )
        );
    }
}

class AllDataBox extends React.PureComponent {

    constructor(props) {
        super(props);
        this.SearchAspectTypes = Object.freeze({ sobject: "sobject", users: "users" }); //Enum. Supported aspects

        this.state = {
            activeSearchAspect: this.SearchAspectTypes.sobject,
            sobjectsList: null,
            sobjectsLoading: true,
            usersBoxLoading: false,
            contextRecordId: null,
            contextUserId: null,
            contextOrgId: null,
            contextPath: null,
        };
        this.onAspectClick = this.onAspectClick.bind(this);
        this.parseContextUrl = this.ensureKnownBrowserContext.bind(this);
    }

    componentDidMount() {
        this.ensureKnownBrowserContext();
        this.loadSobjects();
    }

    componentDidUpdate(prevProps, prevState) {
        let { activeSearchAspect } = this.state;
        if (prevProps.contextUrl !== this.props.contextUrl) {
            this.ensureKnownBrowserContext();
        }
        if (prevState.activeSearchAspect !== activeSearchAspect) {
            switch (activeSearchAspect) {
                case this.SearchAspectTypes.sobject:
                    this.ensureKnownBrowserContext();
                    break;
                case this.SearchAspectTypes.users:
                    this.ensureKnownUserContext();
                    break;
            }
        }
    }

    ensureKnownBrowserContext() {
        let { contextUrl } = this.props;
        if (contextUrl) {
            let recordId = getRecordId(contextUrl);
            let path = getSfPathFromUrl(contextUrl);
            this.setState({
                contextRecordId: recordId,
                contextPath: path
            });
        }
    }

    setIsLoading(aspect, value) {
        switch (aspect) {
            case "usersBox": this.setState({ usersBoxLoading: value });
                break;
        }
    }

    isLoading() {
        let { usersBoxLoading, sobjectsLoading } = this.state;
        return sobjectsLoading || usersBoxLoading;
    }

    async ensureKnownUserContext() {
        let { contextUserId, contextOrgId } = this.state;

        if (!contextUserId || !contextOrgId) {
            try {
                const userInfo = await sfConn.rest("/services/oauth2/userinfo");
                let contextUserId = userInfo.user_id;
                let contextOrgId = userInfo.organization_id;
                this.setState({ contextUserId, contextOrgId });
            } catch (err) {
                console.error("Unable to query user context", err);
            }
        }
    }

    onAspectClick(e) {
        this.setState({
            activeSearchAspect: e.currentTarget.dataset.aspect
        });
    }

    loadSobjects() {
        let entityMap = new Map();

        function addEntity({ name, label, keyPrefix }, api) {
            label = label || ""; // Avoid null exceptions if the object does not have a label (some don't). All objects have a name. Not needed for keyPrefix since we only do equality comparisons on those.
            let entity = entityMap.get(name);
            if (entity) {
                if (!entity.label) { // Doesn't seem to be needed, but if we have to do it for keyPrefix, we can just as well do it for label.
                    entity.label = label;
                }
                if (!entity.keyPrefix) { // For some objects the keyPrefix is only available in some of the APIs.
                    entity.keyPrefix = keyPrefix;
                }
            } else {
                entity = {
                    availableApis: [],
                    name,
                    label,
                    keyPrefix,
                    availableKeyPrefix: null,
                };
                entityMap.set(name, entity);
            }
            if (api) {
                entity.availableApis.push(api);
                if (keyPrefix) {
                    entity.availableKeyPrefix = keyPrefix;
                }
            }
        }

        function getObjects(url, api) {
            return sfConn.rest(url).then(describe => {
                for (let sobject of describe.sobjects) {
                    addEntity(sobject, api);
                }
            }).catch(err => {
                console.error("list " + api + " sobjects", err);
            });
        }

        function getEntityDefinitions(bucket) {
            let query = "select QualifiedApiName, Label, KeyPrefix from EntityDefinition" + bucket;
            return sfConn.rest("/services/data/v" + apiVersion + "/tooling/query?q=" + encodeURIComponent(query)).then(res => {
                for (let record of res.records) {
                    addEntity({
                        name: record.QualifiedApiName,
                        label: record.Label,
                        keyPrefix: record.KeyPrefix
                    }, null);
                }
            }).catch(err => {
                console.error("list entity definitions: " + bucket, err);
            });
        }

        Promise.all([
            // Get objects the user can access from the regular API
            getObjects("/services/data/v" + apiVersion + "/sobjects/", "regularApi"),
            // Get objects the user can access from the tooling API
            getObjects("/services/data/v" + apiVersion + "/tooling/sobjects/", "toolingApi"),
            // Get all objects, even the ones the user cannot access from any API
            // These records are less interesting than the ones the user has access to, but still interesting since we can get information about them using the tooling API
            // If there are too many records, we get "EXCEEDED_ID_LIMIT: EntityDefinition does not support queryMore(), use LIMIT to restrict the results to a single batch"
            // We cannot use limit and offset to work around it, since EntityDefinition does not support those according to the documentation, and they seem to work in a querky way in practice.
            // Tried to use http://salesforce.stackexchange.com/a/22643, but "order by x" uses AaBbCc as sort order, while "where x > ..." uses sort order ABCabc, so it does not work on text fields, and there is no unique numerical field we can sort by.
            // Here we split the query into a somewhat arbitrary set of fixed buckets, and hope none of the buckets exceed 2000 records.
            getEntityDefinitions(" where QualifiedApiName < 'M' limit 2000"),
            getEntityDefinitions(" where QualifiedApiName >= 'M' limit 2000"),
        ])
            .then(() => {
                // TODO progressively display data as each of the three responses becomes available
                this.setState({
                    sobjectsLoading: false,
                    sobjectsList: Array.from(entityMap.values())
                });
                this.refs.showAllDataBoxSObject.refs.allDataSearch.getMatchesDelayed("");
            })
            .catch(e => {
                console.error(e);
                this.setState({ sobjectsLoading: false });
            });
    }

    render() {
        let { activeSearchAspect, sobjectsLoading, contextRecordId, contextUserId, contextOrgId, contextPath, sobjectsList } = this.state;
        let { sfHost, showDetailsSupported, linkTarget } = this.props;

        return (
            h("div", { className: "all-data-box " + (this.isLoading() ? "loading " : "") },
                h("ul", { className: "small-tabs" },
                    h("li", { onClick: this.onAspectClick, "data-aspect": this.SearchAspectTypes.sobject, className: (activeSearchAspect == this.SearchAspectTypes.sobject) ? "active" : "" }, "Objects"),
                    h("li", { onClick: this.onAspectClick, "data-aspect": this.SearchAspectTypes.users, className: (activeSearchAspect == this.SearchAspectTypes.users) ? "active" : "" }, "Users")
                ),

                (activeSearchAspect == this.SearchAspectTypes.sobject)
                    ? h(AllDataBoxSObject, { ref: "showAllDataBoxSObject", sfHost, showDetailsSupported, sobjectsList, sobjectsLoading, contextRecordId, linkTarget })
                    : (activeSearchAspect == this.SearchAspectTypes.users)
                        ? h(AllDataBoxUsers, { ref: "showAllDataBoxUsers", sfHost, linkTarget, contextUserId, contextOrgId, contextPath, setIsLoading: (value) => { this.setIsLoading("usersBox", value); } }, "Users")
                        : "AllData aspect " + activeSearchAspect + " not implemented"
            )
        );
    }
}

class AllDataBoxUsers extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedUser: null,
            selectedUserId: null,
        };
        this.getMatches = this.getMatches.bind(this);
        this.onDataSelect = this.onDataSelect.bind(this);
    }

    componentDidMount() {
        let { contextUserId } = this.props;
        this.onDataSelect({ Id: contextUserId });
        this.refs.allDataSearch.refs.showAllDataInp.focus();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contextUserId !== this.props.contextUserId) {
            this.onDataSelect({ Id: this.props.contextUserId });
        }
    }

    async getMatches(userQuery) {
        let { setIsLoading } = this.props;
        if (!userQuery) {
            return [];
        }

        //TODO: Better search query. SOSL?
        const fullQuerySelect = "select Id, Name, Email, Username, UserRole.Name, Alias, LocaleSidKey, LanguageLocaleKey, IsActive, ProfileId, Profile.Name";
        const minimalQuerySelect = "select Id, Name, Email, Username, UserRole.Name, Alias, LocaleSidKey, LanguageLocaleKey, IsActive";
        const queryFrom = "from User where isactive=true and (username like '%" + userQuery + "%' or name like '%" + userQuery + "%') order by LastLoginDate limit 100";
        const compositeQuery = {
            "compositeRequest": [
                {
                    "method": "GET",
                    "url": "/services/data/v47.0/query/?q=" + encodeURIComponent(fullQuerySelect + " " + queryFrom),
                    "referenceId": "fullData"
                }, {
                    "method": "GET",
                    "url": "/services/data/v47.0/query/?q=" + encodeURIComponent(minimalQuerySelect + " " + queryFrom),
                    "referenceId": "minimalData"
                }
            ]
        };

        try {
            setIsLoading(true);
            const userSearchResult = await sfConn.rest("/services/data/v" + apiVersion + "/composite", { method: "POST", body: compositeQuery });
            let users = userSearchResult.compositeResponse.find((elm) => elm.httpStatusCode == 200).body.records;
            return users;
        } catch (err) {
            console.error("Unable to query user details with: " + JSON.stringify(compositeQuery) + ".", err);
            return [];
        } finally {
            setIsLoading(false);
        }

    }

    async onDataSelect(userRecord) {
        if (userRecord && userRecord.Id) {
            await this.setState({ selectedUserId: userRecord.Id, selectedUser: null });
            await this.querySelectedUserDetails();
        }
    }

    async querySelectedUserDetails() {
        let { selectedUserId } = this.state;
        let { setIsLoading } = this.props;

        if (!selectedUserId) {
            return;
        }
        //Optimistically attempt broad query (fullQuery) and fall back to minimalQuery to ensure some data is returned in most cases (e.g. profile cannot be queried by community users)
        const fullQuerySelect = "select Id, Name, Email, Username, UserRole.Name, Alias, LocaleSidKey, LanguageLocaleKey, IsActive, FederationIdentifier, ProfileId, Profile.Name";
        const minimalQuerySelect = "select Id, Name, Email, Username, UserRole.Name, Alias, LocaleSidKey, LanguageLocaleKey, IsActive, FederationIdentifier";
        const queryFrom = "from User where Id='" + selectedUserId + "' limit 1";
        const compositeQuery = {
            "compositeRequest": [
                {
                    "method": "GET",
                    "url": "/services/data/v47.0/query/?q=" + encodeURIComponent(fullQuerySelect + " " + queryFrom),
                    "referenceId": "fullData"
                }, {
                    "method": "GET",
                    "url": "/services/data/v47.0/query/?q=" + encodeURIComponent(minimalQuerySelect + " " + queryFrom),
                    "referenceId": "minimalData"
                }
            ]
        };

        try {
            setIsLoading(true);
            //const userResult = await sfConn.rest("/services/data/v" + apiVersion + "/sobjects/User/" + selectedUserId); //Does not return profile details. Query call is therefore prefered
            const userResult = await sfConn.rest("/services/data/v" + apiVersion + "/composite", { method: "POST", body: compositeQuery });
            let userDetail = userResult.compositeResponse.find((elm) => elm.httpStatusCode == 200).body.records[0];
            await this.setState({ selectedUser: userDetail });
        } catch (err) {
            console.error("Unable to query user details with: " + JSON.stringify(compositeQuery) + ".", err);
        } finally {
            setIsLoading(false);
        }
    }

    resultRender(matches, userQuery) {
        return matches.map(value => ({
            key: value.Id,
            value,
            element: [
                h("div", { className: "autocomplete-item-main", key: "main" },
                    h(MarkSubstring, {
                        text: value.Name + " (" + value.Alias + ")",
                        start: value.Name.toLowerCase().indexOf(userQuery.toLowerCase()),
                        length: userQuery.length
                    })),
                h("div", { className: "autocomplete-item-sub small", key: "sub" },
                    h("div", {}, (value.Profile) ? value.Profile.Name : ""),
                    h(MarkSubstring, {
                        text: (!value.IsActive) ? "⚠ " + value.Username : value.Username,
                        start: value.Username.toLowerCase().indexOf(userQuery.toLowerCase()),
                        length: userQuery.length
                    }))
            ]
        }));
    }

    render() {
        let { selectedUser } = this.state;
        let { sfHost, linkTarget, contextOrgId, contextUserId, contextPath } = this.props;

        return (
            h("div", { ref: "usersBox", className: "users-box" },
                h(AllDataSearch, { ref: "allDataSearch", getMatches: this.getMatches, onDataSelect: this.onDataSelect, inputSearchDelay: 400, placeholderText: "Username, email, alias or name of user", resultRender: this.resultRender }),
                h("div", { className: "all-data-box-inner" + (!selectedUser ? " empty" : "") },
                    selectedUser
                        ? h(UserDetails, { user: selectedUser, sfHost, contextOrgId, currentUserId: contextUserId, linkTarget, contextPath })
                        : h("div", { className: "center" }, "No user details available")
                ))
        );
    }
}

class AllDataBoxSObject extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: null,
            recordIdDetails: null
        };
        this.onDataSelect = this.onDataSelect.bind(this);
        this.getMatches = this.getMatches.bind(this);
    }

    componentDidMount() {
        let { contextRecordId } = this.props;
        this.updateSelection(contextRecordId);
    }

    componentDidUpdate(prevProps) {
        let { contextRecordId, sobjectsLoading } = this.props;
        if (prevProps.contextRecordId !== contextRecordId) {
            this.updateSelection(contextRecordId);
        }
        if (prevProps.sobjectsLoading !== sobjectsLoading && !sobjectsLoading) {
            this.updateSelection(contextRecordId);
        }
    }

    async updateSelection(query) {
        let match = this.getBestMatch(query);
        await this.setState({ selectedValue: match });
        this.loadRecordIdDetails();
    }

    loadRecordIdDetails() {
        let { selectedValue } = this.state;
        //If a recordId is selected and the object supports regularApi
        if (selectedValue && selectedValue.recordId && selectedValue.sobject && selectedValue.sobject.availableApis && selectedValue.sobject.availableApis.includes("regularApi")) {
            //optimistically assume the object has certain attribues. If some are not present, no recordIdDetails are displayed
            //TODO: Better handle objects with no recordtypes. Currently the optimistic approach results in no record details being displayed for ids for objects without record types.
            let query = "select Id, LastModifiedBy.Alias, CreatedBy.Alias, RecordType.DeveloperName, CreatedDate, LastModifiedDate from " + selectedValue.sobject.name + " where id='" + selectedValue.recordId + "'";
            sfConn.rest("/services/data/v" + apiVersion + "/query?q=" + encodeURIComponent(query), { logErrors: false }).then(res => {
                for (let record of res.records) {
                    let lastModifiedDate = new Date(record.LastModifiedDate);
                    let createdDate = new Date(record.CreatedDate);
                    this.setState({
                        recordIdDetails: {
                            "recordTypeName": (record.RecordType) ? record.RecordType.DeveloperName : "-",
                            "createdBy": record.CreatedBy.Alias,
                            "lastModifiedBy": record.LastModifiedBy.Alias,
                            "created": createdDate.toLocaleDateString() + " " + createdDate.toLocaleTimeString(),
                            "lastModified": lastModifiedDate.toLocaleDateString() + " " + lastModifiedDate.toLocaleTimeString(),
                        }
                    });
                }
            }).catch(() => {
                //Swallow this exception since it is likely due to missing standard attributes on the record - i.e. an invalid query.
                this.setState({ recordIdDetails: null });
            });

        } else {
            this.setState({ recordIdDetails: null });
        }
    }

    getBestMatch(query) {
        let { sobjectsList } = this.props;
        // Find the best match based on the record id or object name from the page URL.
        if (!query) {
            return null;
        }
        if (!sobjectsList) {
            return null;
        }
        let sobject = sobjectsList.find(sobject => sobject.name.toLowerCase() == query.toLowerCase());
        let queryKeyPrefix = query.substring(0, 3);
        if (!sobject) {
            sobject = sobjectsList.find(sobject => sobject.availableKeyPrefix == queryKeyPrefix);
        }
        if (!sobject) {
            sobject = sobjectsList.find(sobject => sobject.keyPrefix == queryKeyPrefix);
        }
        if (!sobject) {
            return null;
        }
        let recordId = null;
        if (sobject.keyPrefix == queryKeyPrefix && query.match(/^([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})$/)) {
            recordId = query;
        }
        return { recordId, sobject };
    }

    getMatches(query) {
        let { sobjectsList, contextRecordId } = this.props;

        if (!sobjectsList) {
            return [];
        }
        let queryKeyPrefix = query.substring(0, 3);
        let res = sobjectsList
            .filter(sobject => sobject.name.toLowerCase().includes(query.toLowerCase()) || sobject.label.toLowerCase().includes(query.toLowerCase()) || sobject.keyPrefix == queryKeyPrefix)
            .map(sobject => ({
                recordId: null,
                sobject,
                // TO-DO: merge with the sortRank function in data-export
                relevance:
                    (sobject.keyPrefix == queryKeyPrefix ? 2
                        : sobject.name.toLowerCase() == query.toLowerCase() ? 3
                            : sobject.label.toLowerCase() == query.toLowerCase() ? 4
                                : sobject.name.toLowerCase().startsWith(query.toLowerCase()) ? 5
                                    : sobject.label.toLowerCase().startsWith(query.toLowerCase()) ? 6
                                        : sobject.name.toLowerCase().includes("__" + query.toLowerCase()) ? 7
                                            : sobject.name.toLowerCase().includes("_" + query.toLowerCase()) ? 8
                                                : sobject.label.toLowerCase().includes(" " + query.toLowerCase()) ? 9
                                                    : 10) + (sobject.availableApis.length == 0 ? 20 : 0)
            }));
        query = query || contextRecordId || "";
        queryKeyPrefix = query.substring(0, 3);
        if (query.match(/^([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})$/)) {
            let objectsForId = sobjectsList.filter(sobject => sobject.keyPrefix == queryKeyPrefix);
            for (let sobject of objectsForId) {
                res.unshift({ recordId: query, sobject, relevance: 1 });
            }
        }
        res.sort((a, b) => a.relevance - b.relevance || a.sobject.name.localeCompare(b.sobject.name));
        return res;
    }

    onDataSelect(value) {
        this.setState({ selectedValue: value }, () => {
            this.loadRecordIdDetails();
        });
    }

    clickShowDetailsBtn() {
        if (this.refs.allDataSelection) {
            this.refs.allDataSelection.clickShowDetailsBtn();
        }
    }

    clickAllDataBtn() {
        if (this.refs.allDataSelection) {
            this.refs.allDataSelection.clickAllDataBtn();
        }
    }

    resultRender(matches, userQuery) {
        return matches.map(value => ({
            key: value.recordId + "#" + value.sobject.name,
            value,
            element: [
                h("div", { className: "autocomplete-item-main", key: "main" },
                    value.recordId || h(MarkSubstring, {
                        text: value.sobject.name,
                        start: value.sobject.name.toLowerCase().indexOf(userQuery.toLowerCase()),
                        length: userQuery.length
                    }),
                    value.sobject.availableApis.length == 0 ? " (Not readable)" : ""
                ),
                h("div", { className: "autocomplete-item-sub", key: "sub" },
                    h(MarkSubstring, {
                        text: value.sobject.keyPrefix || "---",
                        start: value.sobject.keyPrefix == userQuery.substring(0, 3) ? 0 : -1,
                        length: 3
                    }),
                    " • ",
                    h(MarkSubstring, {
                        text: value.sobject.label,
                        start: value.sobject.label.toLowerCase().indexOf(userQuery.toLowerCase()),
                        length: userQuery.length
                    })
                )
            ]
        }));
    }

    render() {
        let { sfHost, showDetailsSupported, sobjectsList, linkTarget, contextRecordId } = this.props;
        let { selectedValue, recordIdDetails } = this.state;
        return (
            h("div", {},
                h(AllDataSearch, { ref: "allDataSearch", onDataSelect: this.onDataSelect, sobjectsList, getMatches: this.getMatches, inputSearchDelay: 0, placeholderText: "Record id, id prefix or object name", resultRender: this.resultRender }),
                selectedValue
                    ? h(AllDataSelection, { ref: "allDataSelection", sfHost, showDetailsSupported, selectedValue, linkTarget, recordIdDetails, contextRecordId })
                    : h("div", { className: "all-data-box-inner empty" }, "No record to display")
            )
        );
    }
}

class UserDetails extends React.PureComponent {
    doSupportLoginAs(user) {
        let { currentUserId } = this.props;
        //Optimistically show login unless it's logged in user's userid or user is inactive.
        //No API to determine if user is allowed to login as given user. See https://salesforce.stackexchange.com/questions/224342/query-can-i-login-as-for-users
        if (!user || user.Id == currentUserId || !user.IsActive) {
            return false;
        }
        return true;
    }

    getLoginAsLink(userId) {
        let { sfHost, contextOrgId, contextPath } = this.props;
        const retUrl = contextPath || "/";
        const targetUrl = contextPath || "/";
        return "https://" + sfHost + "/servlet/servlet.su" + "?oid=" + encodeURIComponent(contextOrgId) + "&suorgadminid=" + encodeURIComponent(userId) + "&retURL=" + encodeURIComponent(retUrl) + "&targetURL=" + encodeURIComponent(targetUrl);
    }

    getUserDetailLink(userId) {
        let { sfHost } = this.props;
        return "https://" + sfHost + "/lightning/setup/ManageUsers/page?address=%2F" + userId + "%3Fnoredirect%3D1";
    }

    getProfileLink(profileId) {
        let { sfHost } = this.props;
        return "https://" + sfHost + "/lightning/setup/EnhancedProfiles/page?address=%2F" + profileId;
    }

    render() {
        let { user, linkTarget } = this.props;

        return (
            h("div", { className: "all-data-box-inner" },
                h("div", { className: "all-data-box-data" },
                    h("table", { className: (user.IsActive) ? "" : "inactive" },
                        h("tbody", {},
                            h("tr", {},
                                h("th", {}, "Name:"),
                                h("td", {},
                                    (user.IsActive) ? "" : h("span", { title: "User is inactive" }, "⚠ "),
                                    user.Name + " (" + user.Alias + ")"
                                )
                            ),
                            h("tr", {},
                                h("th", {}, "Username:"),
                                h("td", { className: "oneliner" }, user.Username)
                            ),
                            h("tr", {},
                                h("th", {}, "E-mail:"),
                                h("td", { className: "oneliner" }, user.Email)
                            ),
                            h("tr", {},
                                h("th", {}, "Profile:"),
                                h("td", { className: "oneliner" },
                                    (user.Profile)
                                        ? h("a", { href: this.getProfileLink(user.ProfileId), target: linkTarget }, user.Profile.Name)
                                        : h("em", { className: "inactive" }, "unknown")
                                )
                            ),
                            h("tr", {},
                                h("th", {}, "Role:"),
                                h("td", { className: "oneliner" }, (user.UserRole) ? user.UserRole.Name : "")
                            ),
                            h("tr", {},
                                h("th", {}, "Language:"),
                                h("td", {},
                                    h("div", { className: "flag flag-" + sfLocaleKeyToCountryCode(user.LanguageLocaleKey), title: "Language: " + user.LanguageLocaleKey }),
                                    " | ",
                                    h("div", { className: "flag flag-" + sfLocaleKeyToCountryCode(user.LocaleSidKey), title: "Locale: " + user.LocaleSidKey })
                                )
                            )
                        )
                    )),
                h("div", { ref: "userButtons", className: "center" },
                    this.doSupportLoginAs(user) ? h("a", { href: this.getLoginAsLink(user.Id), target: linkTarget, className: "button button-secondary" }, "Try login as") : null,
                    h("a", { href: this.getUserDetailLink(user.Id), target: linkTarget, className: "button button-secondary" }, "Details")
                ))
        );
    }
}


class ShowDetailsButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            detailsLoading: false,
            detailsShown: false,
        };
        this.onDetailsClick = this.onDetailsClick.bind(this);
    }
    canShowDetails() {
        let { showDetailsSupported, selectedValue, contextRecordId } = this.props;
        return showDetailsSupported && contextRecordId && selectedValue.sobject.keyPrefix == contextRecordId.substring(0, 3) && selectedValue.sobject.availableApis.length > 0;
    }
    onDetailsClick() {
        let { sfHost, selectedValue } = this.props;
        let { detailsShown } = this.state;
        if (detailsShown || !this.canShowDetails()) {
            return;
        }
        let tooling = !selectedValue.sobject.availableApis.includes("regularApi");
        let url = "/services/data/v" + apiVersion + "/" + (tooling ? "tooling/" : "") + "sobjects/" + selectedValue.sobject.name + "/describe/";
        this.setState({ detailsShown: true, detailsLoading: true });
        Promise.all([
            sfConn.rest(url),
            getAllFieldSetupLinks(sfHost, selectedValue.sobject.name)
        ]).then(([res, insextAllFieldSetupLinks]) => {
            this.setState({ detailsShown: true, detailsLoading: false });
            parent.postMessage({ insextShowStdPageDetails: true, insextData: res, insextAllFieldSetupLinks }, "*");
            closePopup();
        }).catch(error => {
            this.setState({ detailsShown: false, detailsLoading: false });
            console.error(error);
            alert(error);
        });
    }
    render() {
        let { detailsLoading, detailsShown } = this.state;
        return (
            h("button",
                {
                    id: "showStdPageDetailsBtn",
                    className: "button" + (detailsLoading ? " loading" : ""),
                    disabled: detailsShown,
                    onClick: this.onDetailsClick,
                    style: { display: !this.canShowDetails() ? "none" : "" }
                },
                "Show field ", h("u", {}, "m"), "etadata"
            )
        );
    }
}


class AllDataSelection extends React.PureComponent {
    clickShowDetailsBtn() {
        this.refs.showDetailsBtn.onDetailsClick();
    }
    clickAllDataBtn() {
        this.refs.showAllDataBtn.click();
    }
    getAllDataUrl(toolingApi) {
        let { sfHost, selectedValue } = this.props;
        if (selectedValue) {
            let args = new URLSearchParams();
            args.set("host", sfHost);
            args.set("objectType", selectedValue.sobject.name);
            if (toolingApi) {
                args.set("useToolingApi", "1");
            }
            if (selectedValue.recordId) {
                args.set("recordId", selectedValue.recordId);
            }
            return "inspect.html?" + args;
        } else {
            return undefined;
        }
    }
    getDeployStatusUrl() {
        let { sfHost, selectedValue } = this.props;
        let args = new URLSearchParams();
        args.set("host", sfHost);
        args.set("checkDeployStatus", selectedValue.recordId);
        return "explore-api.html?" + args;
    }
    /**
     * Optimistically generate lightning setup uri for the provided object api name.
     */
    getObjectSetupLink(sobjectName) {
        return "https://" + this.props.sfHost + "/lightning/setup/ObjectManager/" + sobjectName + "/FieldsAndRelationships/view";
    }
    render() {
        let { sfHost, showDetailsSupported, contextRecordId, selectedValue, linkTarget, recordIdDetails } = this.props;
        // Show buttons for the available APIs.
        let buttons = Array.from(selectedValue.sobject.availableApis);
        buttons.sort();
        if (buttons.length == 0) {
            // If none of the APIs are available, show a button for the regular API, which will partly fail, but still show some useful metadata from the tooling API.
            buttons.push("noApi");
        }
        return (
            h("div", { className: "all-data-box-inner" },
                h("div", { className: "all-data-box-data" },
                    h("table", {},
                        h("tbody", {},
                            h("tr", {},
                                h("th", {}, "Name:"),
                                h("td", {},
                                    h("a", { href: this.getObjectSetupLink(selectedValue.sobject.name), target: linkTarget }, selectedValue.sobject.name)
                                )
                            ),
                            h("tr", {},
                                h("th", {}, "Label:"),
                                h("td", {}, selectedValue.sobject.label)
                            ),
                            h("tr", {},
                                h("th", {}, "Id:"),
                                h("td", {},
                                    h("span", {}, selectedValue.sobject.keyPrefix),
                                    h("span", {}, (selectedValue.recordId) ? " / " + selectedValue.recordId : ""),
                                )
                            ))),


                    h(AllDataRecordDetails, { recordIdDetails, className: "top-space" }),
                ),
                h(ShowDetailsButton, { ref: "showDetailsBtn", sfHost, showDetailsSupported, selectedValue, contextRecordId }),
                selectedValue.recordId && selectedValue.recordId.startsWith("0Af")
                    ? h("a", { href: this.getDeployStatusUrl(), target: linkTarget, className: "button" }, "Check Deploy Status") : null,
                buttons.map((button, index) => h("a",
                    {
                        key: button,
                        // If buttons for both APIs are shown, the keyboard shortcut should open the first button.
                        ref: index == 0 ? "showAllDataBtn" : null,
                        href: this.getAllDataUrl(button == "toolingApi"),
                        target: linkTarget,
                        className: "button"
                    },
                    index == 0 ? h("span", {}, "Show ", h("u", {}, "a"), "ll data") : "Show all data",
                    button == "regularApi" ? ""
                        : button == "toolingApi" ? " (Tooling API)"
                            : " (Not readable)"
                ))
            )
        );
    }
}

class AllDataRecordDetails extends React.PureComponent {
    render() {
        let { recordIdDetails, className } = this.props;
        if (recordIdDetails) {
            return (
                h("table", { className },
                    h("tbody", {},
                        h("tr", {},
                            h("th", {}, "RecType:"),
                            h("td", {}, recordIdDetails.recordTypeName)
                        ),
                        h("tr", {},
                            h("th", {}, "Created:"),
                            h("td", {}, recordIdDetails.created + " (" + recordIdDetails.createdBy + ")")
                        ),
                        h("tr", {},
                            h("th", {}, "Edited:"),
                            h("td", {}, recordIdDetails.lastModified + " (" + recordIdDetails.lastModifiedBy + ")")
                        )
                    )));
        } else {
            return null;
        }
    }
}

class AllDataSearch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            queryString: "",
            matchingResults: [],
            queryDelayTimer: null
        };
        this.onAllDataInput = this.onAllDataInput.bind(this);
        this.onAllDataFocus = this.onAllDataFocus.bind(this);
        this.onAllDataBlur = this.onAllDataBlur.bind(this);
        this.onAllDataKeyDown = this.onAllDataKeyDown.bind(this);
        this.updateAllDataInput = this.updateAllDataInput.bind(this);
        this.onAllDataArrowClick = this.onAllDataArrowClick.bind(this);
    }
    componentDidMount() {
        let { queryString } = this.state;
        this.getMatchesDelayed(queryString);
    }
    onAllDataInput(e) {
        let val = e.target.value;
        this.refs.autoComplete.handleInput();
        this.getMatchesDelayed(val);
        this.setState({ queryString: val });
    }
    onAllDataFocus() {
        this.refs.autoComplete.handleFocus();
    }
    onAllDataBlur() {
        this.refs.autoComplete.handleBlur();
    }
    onAllDataKeyDown(e) {
        this.refs.autoComplete.handleKeyDown(e);
        e.stopPropagation(); // Stop our keyboard shortcut handler
    }
    updateAllDataInput(value) {
        this.props.onDataSelect(value);
        this.setState({ queryString: "" });
        this.getMatchesDelayed("");
    }
    onAllDataArrowClick() {
        this.refs.showAllDataInp.focus();
    }
    getMatchesDelayed(userQuery) {
        let { queryDelayTimer } = this.state;
        let { inputSearchDelay } = this.props;

        if (queryDelayTimer) {
            clearTimeout(queryDelayTimer);
        }
        queryDelayTimer = setTimeout(async () => {
            let { getMatches } = this.props;
            const matchingResults = await getMatches(userQuery);
            await this.setState({ matchingResults });
        }, inputSearchDelay);

        this.setState({ queryDelayTimer });
    }
    render() {
        let { queryString, matchingResults } = this.state;
        let { placeholderText, resultRender } = this.props;
        return (
            h("div", { className: "input-with-dropdown" },
                h("input", {
                    className: "all-data-input",
                    ref: "showAllDataInp",
                    placeholder: placeholderText,
                    onInput: this.onAllDataInput,
                    onFocus: this.onAllDataFocus,
                    onBlur: this.onAllDataBlur,
                    onKeyDown: this.onAllDataKeyDown,
                    value: queryString
                }),
                h(Autocomplete, {
                    ref: "autoComplete",
                    updateInput: this.updateAllDataInput,
                    matchingResults: resultRender(matchingResults, queryString)
                }),
                h("svg", { viewBox: "0 0 24 24", onClick: this.onAllDataArrowClick },
                    h("path", { d: "M3.8 6.5h16.4c.4 0 .8.6.4 1l-8 9.8c-.3.3-.9.3-1.2 0l-8-9.8c-.4-.4-.1-1 .4-1z" })
                )
            )
        );
    }
}

function MarkSubstring({ text, start, length }) {
    if (start == -1) {
        return h("span", {}, text);
    }
    return h("span", {},
        text.substr(0, start),
        h("mark", {}, text.substr(start, length)),
        text.substr(start + length)
    );
}

class Autocomplete extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showResults: false,
            selectedIndex: 0, // Index of the selected autocomplete item.
            scrollToSelectedIndex: 0, // Changed whenever selectedIndex is updated (even if updated to a value it already had). Used to scroll to the selected item.
            scrollTopIndex: 0, // Index of the first autocomplete item that is visible according to the current scroll position.
            itemHeight: 1, // The height of each autocomplete item. All items should have the same height. Measured on first render. 1 means not measured.
            resultsMouseIsDown: false // Hide the autocomplete popup when the input field looses focus, except when clicking one of the autocomplete items.
        };
        this.onResultsMouseDown = this.onResultsMouseDown.bind(this);
        this.onResultsMouseUp = this.onResultsMouseUp.bind(this);
        this.onResultClick = this.onResultClick.bind(this);
        this.onResultMouseEnter = this.onResultMouseEnter.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }
    handleInput() {
        this.setState({ showResults: true, selectedIndex: 0, scrollToSelectedIndex: this.state.scrollToSelectedIndex + 1 });
    }
    handleFocus() {
        this.setState({ showResults: true, selectedIndex: 0, scrollToSelectedIndex: this.state.scrollToSelectedIndex + 1 });
    }
    handleBlur() {
        this.setState({ showResults: false });
    }
    handleKeyDown(e) {
        let { matchingResults } = this.props;
        let { selectedIndex, showResults, scrollToSelectedIndex } = this.state;
        if (e.key == "Enter") {
            if (!showResults) {
                this.setState({ showResults: true, selectedIndex: 0, scrollToSelectedIndex: scrollToSelectedIndex + 1 });
                return;
            }
            if (selectedIndex < matchingResults.length) {
                e.preventDefault();
                let { value } = matchingResults[selectedIndex];
                this.props.updateInput(value);
                this.setState({ showResults: false, selectedIndex: 0 });
            }
            return;
        }
        if (e.key == "Escape") {
            e.preventDefault();
            this.setState({ showResults: false, selectedIndex: 0 });
            return;
        }
        let selectionMove = 0;
        if (e.key == "ArrowDown") {
            selectionMove = 1;
        }
        if (e.key == "ArrowUp") {
            selectionMove = -1;
        }
        if (selectionMove != 0) {
            e.preventDefault();
            if (!showResults) {
                this.setState({ showResults: true, selectedIndex: 0, scrollToSelectedIndex: scrollToSelectedIndex + 1 });
                return;
            }
            let index = selectedIndex + selectionMove;
            let length = matchingResults.length;
            if (index < 0) {
                index = length - 1;
            }
            if (index > length - 1) {
                index = 0;
            }
            this.setState({ selectedIndex: index, scrollToSelectedIndex: scrollToSelectedIndex + 1 });
        }
    }
    onResultsMouseDown() {
        this.setState({ resultsMouseIsDown: true });
    }
    onResultsMouseUp() {
        this.setState({ resultsMouseIsDown: false });
    }
    onResultClick(value) {
        this.props.updateInput(value);
        this.setState({ showResults: false, selectedIndex: 0 });
    }
    onResultMouseEnter(index) {
        this.setState({ selectedIndex: index, scrollToSelectedIndex: this.state.scrollToSelectedIndex + 1 });
    }
    onScroll() {
        let scrollTopIndex = Math.floor(this.refs.scrollBox.scrollTop / this.state.itemHeight);
        if (scrollTopIndex != this.state.scrollTopIndex) {
            this.setState({ scrollTopIndex });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.itemHeight == 1) {
            let anItem = this.refs.scrollBox.querySelector(".autocomplete-item");
            if (anItem) {
                let itemHeight = anItem.offsetHeight;
                if (itemHeight > 0) {
                    this.setState({ itemHeight });
                }
            }
            return;
        }
        let sel = this.refs.selectedItem;
        let marginTop = 5;
        if (this.state.scrollToSelectedIndex != prevState.scrollToSelectedIndex && sel && sel.offsetParent) {
            if (sel.offsetTop + marginTop < sel.offsetParent.scrollTop) {
                sel.offsetParent.scrollTop = sel.offsetTop + marginTop;
            } else if (sel.offsetTop + marginTop + sel.offsetHeight > sel.offsetParent.scrollTop + sel.offsetParent.offsetHeight) {
                sel.offsetParent.scrollTop = sel.offsetTop + marginTop + sel.offsetHeight - sel.offsetParent.offsetHeight;
            }
        }
    }
    render() {
        let { matchingResults } = this.props;
        let {
            showResults,
            selectedIndex,
            scrollTopIndex,
            itemHeight,
            resultsMouseIsDown,
        } = this.state;
        // For better performance only render the visible autocomplete items + at least one invisible item above and below (if they exist)
        const RENDERED_ITEMS_COUNT = 11;
        let firstIndex = 0;
        let lastIndex = matchingResults.length - 1;
        let firstRenderedIndex = Math.max(0, scrollTopIndex - 2);
        let lastRenderedIndex = Math.min(lastIndex, firstRenderedIndex + RENDERED_ITEMS_COUNT);
        let topSpace = (firstRenderedIndex - firstIndex) * itemHeight;
        let bottomSpace = (lastIndex - lastRenderedIndex) * itemHeight;
        let topSelected = (selectedIndex - firstIndex) * itemHeight;
        return (
            h("div", { className: "autocomplete-container", style: { display: (showResults && matchingResults.length > 0) || resultsMouseIsDown ? "" : "none" }, onMouseDown: this.onResultsMouseDown, onMouseUp: this.onResultsMouseUp },
                h("div", { className: "autocomplete", onScroll: this.onScroll, ref: "scrollBox" },
                    h("div", { ref: "selectedItem", style: { position: "absolute", top: topSelected + "px", height: itemHeight + "px" } }),
                    h("div", { style: { height: topSpace + "px" } }),
                    matchingResults.slice(firstRenderedIndex, lastRenderedIndex + 1)
                        .map(({ key, value, element }, index) =>
                            h("a", {
                                key,
                                className: "autocomplete-item " + (selectedIndex == index + firstRenderedIndex ? "selected" : ""),
                                onClick: () => this.onResultClick(value),
                                onMouseEnter: () => this.onResultMouseEnter(index + firstRenderedIndex)
                            }, element)
                        ),
                    h("div", { style: { height: bottomSpace + "px" } })
                )
            )
        );
    }
}

function getRecordId(href) {
    let url = new URL(href);
    // Find record ID from URL
    let searchParams = new URLSearchParams(url.search.substring(1));
    // Salesforce Classic and Console
    if (url.hostname.endsWith(".salesforce.com")) {
        let match = url.pathname.match(/\/([a-zA-Z0-9]{3}|[a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})(?:\/|$)/);
        if (match) {
            let res = match[1];
            if (res.includes("0000") || res.length == 3) {
                return match[1];
            }
        }
    }

    // Lightning Experience and Salesforce1
    if (url.hostname.endsWith(".lightning.force.com")) {
        let match;

        if (url.pathname == "/one/one.app") {
            // Pre URL change: https://docs.releasenotes.salesforce.com/en-us/spring18/release-notes/rn_general_enhanced_urls_cruc.htm
            match = url.hash.match(/\/sObject\/([a-zA-Z0-9]+)(?:\/|$)/);
        } else {
            match = url.pathname.match(/\/lightning\/[r|o]\/[a-zA-Z0-9_]+\/([a-zA-Z0-9]+)/);
        }
        if (match) {
            return match[1];
        }
    }
    // Visualforce
    {
        let idParam = searchParams.get("id");
        if (idParam) {
            return idParam;
        }
    }
    // Visualforce page that does not follow standard Visualforce naming
    for (let [, p] of searchParams) {
        if (p.match(/^([a-zA-Z0-9]{3}|[a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})$/) && p.includes("0000")) {
            return p;
        }
    }
    return null;
}

function getSfPathFromUrl(href) {
    let url = new URL(href);
    if (url.protocol.endsWith("-extension:")) {
        return "/";
    }
    return url.pathname;
}

function sfLocaleKeyToCountryCode(localeKey) {
    //Converts a Salesforce locale key to a lower case country code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) or "".
    if (!localeKey) { return ""; }
    return localeKey.split("_").pop().toLowerCase();
}

window.getRecordId = getRecordId; // for unit tests
