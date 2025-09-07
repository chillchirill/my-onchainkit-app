// import React from "react";

// function bigIntToFormat_old(num, cur) {
// 	function toSup(numSup) {
// 		return <sup>${String(numSup)}</sup>;
// 	}
// 	cur = cur.toLowerCase();
// 	num = BigInt(num);
// 	let str = String(num);
// 	let length = str.length;
// 	switch (cur) {
// 		case "wei":
// 			str = str.slice(0, 9);
// 			if (length > 9) {
// 				length -= 9;
// 				return <>{str} × 10{toSup(length)} wei</>;
// 			} else {
// 				return <>{str} wei</>;
// 			}
// 		case "gwei":
// 			str = str.slice(0, 9);
// 			if (length > 9) {
// 				if (length > 18) {
// 					length -= 18;
// 					return <>{str} × 10{toSup(length)} gwei</>;
// 				} else {
// 					length -= 9;
// 					str = str.split("");
// 					str.splice(length, 0, ".");
// 					str = str.join("");
// 					return <>{str} gwei</>;
// 				}
// 			} else {
// 				str = str.split("");
// 				str.splice(1, 0, ".");
// 				str = str.join("");
// 				length -= 10;
// 				if (length === 0) {
// 					return <>{str} gwei</>;
// 				} else {
// 					return <>{str} × 10{toSup(length)} gwei</>;
// 				}
// 			}
// 		case "eth":
// 			str = str.slice(0, 9);
// 			if (length > 18) {
// 				if (length > 27) {
// 					length -= 27;
// 					return <>{str} × 10{toSup(length)} ETH</>;
// 				} else {
// 					length -= 18;
// 					str = str.split("");
// 					str.splice(length, 0, ".");
// 					str = str.join("");
// 					return <>{str} ETH</>;
// 				}
// 			} else {
// 				str = str.split("");
// 				str.splice(1, 0, ".");
// 				str = str.join("");
// 				length -= 19;
// 				if (length === 0) {
// 					return <>{str} ETH</>;
// 				} else {
// 					return <>{str} × 10{toSup(length)} ETH</>;
// 				}
// 			}
// 		case "$":
// 			//ethCurrency should be defined
// 			if (!ethCurrency) {
// 				console.error("ethCurrency not defined");
// 			}
// 			let numberSup = (Number(num) / 10 ** 18) * ethCurrency;
// 			return new Intl.NumberFormat("de-DE", {
// 				style: "currency",
// 				currency: "USD",
// 				// minimumFractionDigits: numberSup < 10 ? 2 : 0,
// 				maximumFractionDigits: numberSup < 10 ? 6 : 2,
// 			}).format(numberSup);
// 	}
// }

// export default bigIntToFormat;