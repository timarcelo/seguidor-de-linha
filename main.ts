//% color=#0fbc11 icon="\uf1b9" block="Sensores de Linha"
namespace sensoreslinha {
    let leftSensorPin: AnalogPin;
    let rightSensorPin: AnalogPin;

    let whiteLeft: number;
    let blackLeft: number;
    let whiteRight: number;
    let blackRight: number;

    let leftSensorValue: number = 0;
    let rightSensorValue: number = 0;
    const ALPHA = 0.5; // Współczynnik wygładzania (między 0 a 1)

    //% blockId=criando_sensores_linha block="Criando o sensor esquedo em %leftPin| e o sensor direito em %rightPin"
    //% weight=100 blockSetVariable=sensorlinha
    export function create(leftPin: AnalogPin, rightPin: AnalogPin): void {
        leftSensorPin = leftPin;
        rightSensorPin = rightPin;
    }

    //% blockId=CALIBRANDO_SENSOR_LINHA block="calibrando sensores"
    //% weight=90
    export function calibrate(): void {
        basic.showString("B");
        while (!input.buttonIsPressed(Button.A)) {
            basic.pause(100);
        }

        whiteLeft = getFilteredReading(leftSensorPin, true);
        whiteRight = getFilteredReading(rightSensorPin, true);

        basic.showString("P");
        while (!input.buttonIsPressed(Button.B)) {
            basic.pause(100);
        }

        blackLeft = getFilteredReading(leftSensorPin, true);
        blackRight = getFilteredReading(rightSensorPin, true);

        basic.showIcon(IconNames.Yes);
    }

    //% blockId=GRAVANDO_SENSOR_ESQUERDO block="Gravando sensor esquerdo"
    //% weight=80
    export function readLeftSensor(): number {
        return Math.round(getFilteredReading(leftSensorPin, false));
    }

    //% blockId=GRAVANDO_SENSOR_DIREITO block="Gravando sensor direito"
    //% weight=80
    export function readRightSensor(): number {
        return Math.round(getFilteredReading(rightSensorPin, false));
    }

    //% blockId=ativando_sensores block="sensor ativo %sensor"
    //% weight=70
    export function isOnLine(sensor: LineFollowerSensor): boolean {
        let sensorValue: number;
        let whiteValue: number;
        let blackValue: number;

        if (sensor === LineFollowerSensor.Left) {
            sensorValue = Math.round(getFilteredReading(leftSensorPin, false));
            whiteValue = whiteLeft;
            blackValue = blackLeft;
        } else {
            sensorValue = Math.round(getFilteredReading(rightSensorPin, false));
            whiteValue = whiteRight;
            blackValue = blackRight;
        }

        return (sensorValue > whiteValue && sensorValue < blackValue);
    }

    function getFilteredReading(pin: AnalogPin, isCalibration: boolean): number {
        let currentValue = pins.analogReadPin(pin);

        if (pin === leftSensorPin) {
            if (isCalibration) {
                leftSensorValue = currentValue;
            } else {
                leftSensorValue = ALPHA * currentValue + (1 - ALPHA) * leftSensorValue;
            }
            return leftSensorValue;
        } else {
            if (isCalibration) {
                rightSensorValue = currentValue;
            } else {
                rightSensorValue = ALPHA * currentValue + (1 - ALPHA) * rightSensorValue;
            }
            return rightSensorValue;
        }
    }

    // Enum for sensors
    export enum LineFollowerSensor {
        //% block="Esquerdo"
        Left,
        //% block="Direito"
        Right
    }
}
