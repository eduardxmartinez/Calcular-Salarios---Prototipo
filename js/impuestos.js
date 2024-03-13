const impuestos = {
    'ISPT': { //Impuesto sobre el producto del trabajo
        0 : [0,0],
        0.0192 : [0.01,496.07],
        0.064 : [496.08,4210.41],
        0.1088 : [4210.42,7399.42],
        0.16 : [7399.43,8601.5],
        0.1792 : [8601.51,10298.35],
        0.2136 : [10298.36,20770.29],
        0.2352 : [20770.3,32736.83],
        0.3 : [32736.84,62500.01],
        0.32 : [62500.02,83333.33],
        0.34 : [83333.34,250000.01],
        0.35 : [250000.02, 999999999999],
    },
    'SEM': 0.0025,//Sistema de ahorro para el retiro IMSS
    'SIV': 0.00625, //Seguro de invalidez y vida IMSS
    'SAR': 0.02, //Sistema de ahorro para el retiro
};

export {impuestos};