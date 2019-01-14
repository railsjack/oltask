kendo.cultures["pt-BR"] = {
    //<language code>-<country/region code>
    name: "pt-BR",
    // "numberFormat" defines general number formatting rules
    numberFormat: {
        //numberFormat has only negative pattern unline the percent and currency
        //negative pattern: one of (n)|-n|- n|n-|n -
        pattern: ["-n"],
        //number of decimal places
        decimals: 2,
        //string that separates the number groups (1,000,000)
        ",": ".",
        //string that separates a number from the fractional point
        ".": ",",
        //the length of each number group
        groupSize: [3],
        //formatting rules for percent number
        percent: {
            //[negative pattern, positive pattern]
            //negativePattern: one of -n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %
            //positivePattern: one of n %|n%|%n|% n
            pattern: ["-n %", "n %"],
            //number of decimal places
            decimals: 2,
            //string that separates the number groups (1,000,000 %)
            ",": ",",
            //string that separates a number from the fractional point
            ".": ".",
            //the length of each number group
            groupSize: [3],
            //percent symbol
            symbol: "%"
        },
        currency: {
            //[negative pattern, positive pattern]
            //negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
            //positivePattern: one of "$n|n$|$ n|n $"
            pattern: ["($n)", "$n"],
            //number of decimal places
            decimals: 2,
            //string that separates the number groups (1,000,000 $)
            ".": ",",
            //string that separates a number from the fractional point
            ",": ".",
            //the length of each number group
            groupSize: [3],
            //currency symbol
            symbol: "$"
        }
    },
    calendars: {
        standard: {
            days: {
                // full day names
                names: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
                // abbreviated day names
                namesAbbr: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                // shortest day names
                namesShort: [ "Do", "Se", "Te", "Qu", "Qi", "Sx", "Sa" ]
            },
            months: {
                // full month names
                names: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                // abbreviated month names
                namesAbbr: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
            },
            // AM and PM designators
            // [standard,lowercase,uppercase]
            AM: [ "AM", "am", "AM" ],
            PM: [ "PM", "pm", "PM" ],
            // set of predefined date and time patterns used by the culture.
            patterns: {
                d: "M/d/yyyy",
                D: "dd 'de' MMMM 'de' yyyy",
                //D: "dddd, MMMM dd, yyyy",
                F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                g: "M/d/yyyy h:mm tt",
                G: "M/d/yyyy h:mm:ss tt",
                m: "MMMM dd",
                M: "MMMM dd",
                s: "yyyy'-'MM'-'ddTHH':'mm':'ss",
                t: "h:mm tt",
                T: "h:mm:ss tt",
                u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                y: "MMMM, yyyy",
                Y: "MMMM, yyyy"
            },
            // the first day of the week (0 = Sunday, 1 = Monday, etc)
                firstDay: 0
        }
    }
};