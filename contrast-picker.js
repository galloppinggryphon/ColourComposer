'use strict'
/**
 * Code from from this W3C document: http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
 *
 * With some improvements.
 *
 * Color brightness is determined by the following formula:
 * ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
 *
 * @param {string} colour Colour in hex format.
 */
function getContrastColour( colour ) {

	const threshold = 130 /* about half of 256. Lower threshold equals more dark text on dark background  */

	const hRed = hexToR( colour )
	const hGreen = hexToG( colour )
	const hBlue = hexToB( colour )

	function hexToR( h ) {
		return parseInt( ( cutHex( h ) ).substring( 0, 2 ), 16 )
	}
	function hexToG( h ) {
		return parseInt( ( cutHex( h ) ).substring( 2, 4 ), 16 )
	}
	function hexToB( h ) {
		return parseInt( ( cutHex( h ) ).substring( 4, 6 ), 16 )
	}
	function cutHex( h ) {
		return ( h.charAt( 0 ) === "#" ) ? h.substring( 1, 7 ) : h
	}

	const cBrightness = ( ( hRed * 299 ) + ( hGreen * 587 ) + ( hBlue * 114 ) ) / 1000
	if ( cBrightness > threshold ) {
		return "#000000"
	} return "#ffffff"
}

function rainbowTable() {
	//test colortable
	const colPairs = new Array( "00", "22", "44", "66", "99", "aa", "cc", "ff" )
	for ( let i = 0; i < colPairs.length; i++ ) {
		for ( let j = 0; j < colPairs.length; j++ ) {
			for ( let k = 0; k < colPairs.length; k++ ) {
				//build a hexcode
				const theColor = "#" + colPairs[ i ] + colPairs[ j ] + colPairs[ k ]

				//checkf for correct textcolor in passed hexcode
				const textcolor = getContrastColour( theColor )

				//output div
				document.write( "<div style='background-color:" + theColor + ";color:" + textcolor + ";' class='colorblock'>" + theColor + "</div>" )
			}
			document.write( "<br/>" )
		}
	}
}
