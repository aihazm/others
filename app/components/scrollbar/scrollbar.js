define(['text!./scroll.ng.html','text!./scroll.css'],function(template, css){
	$("<style>").html(css).appendTo("head");
	var scrollbar = function(){
		return{
			restrict: 'EA',
	        transclude: true,
	        replace:true,
	        scope: {
	        	data:'='
	        },
	        template: template,
	        controller : ['$scope',function($scope){
	        }],
	        link: function(scope, element, attrbs) {
	        	var cfg = {
	        		dragSpeedModifier:1
	        	};
	        	var child = angular.element( element[0].querySelector('.qw-scroll-cnt') ),	        	
                scrlbCnt = angular.element( element[0].querySelector('.qw-scroll-scrlb-cnt') ),
                scrlb = angular.element( scrlbCnt.children()[0] ),
                cntSize = element[0].offsetHeight,
                scrlbLength,
                length = 0;
                //console.log(child,scrlbCnt,scrlb,cntSize,scrlbLength,length);
                
                function scroll(distance){
                	var newMargin = parseInt( child.css('margin-top') || 0 ) + distance;
                	scrollTo(newMargin);
                }
                
                function scrollTo(pos){
                	var newMargin = Math.min(0, Math.max(pos,-length +cntSize));
                	var pct = -newMargin / length;
                	child.css('margin-top', newMargin+'px');
                	scrlb.css('top', pct * cntSize + '3px');
                	//scrlbCnt.css('margin-top', -newMargin + 'px');
                }
                var recalculate = function(){
                	child.css('height','auto');
                	length = child[0].scrollHeight || 0;
                	cfg.dragSpeedModifier = Math.max(1, 1 / ( scrlbLength / cntSize ));
                	child.css('height', length+'px');
                	if(cntSize > length){
                		length = cntSize;
                	}
                	scrlbLength = ( cntSize / length ) * cntSize - 6;
	                scrlb.css('height', scrlbLength + 'px');
	                scrlb.css('transition', 'opacity .3s ease-in-out, border-radius .1s linear, width .1s linear, right .1s linear');	                
	                scroll(0);
	            };
	            
	            child.on('DOMNodeInserted', recalculate);
                child.on('DOMNodeRemoved', recalculate);
                
                child.on('mousewheel', function(event) {
	                event.preventDefault();
	
	                // If jQuery hid the original event, retrieve it
	                if( event.originalEvent != undefined ){
	                	event = event.originalEvent;
	                }
	                var delta = (event.wheelDeltaY || event.wheelDelta);	
	                scroll( delta );
	            });
	            if( window.navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
	                child.on('wheel', function(event) {
	                    event.preventDefault();	
	                    // If jQuery hid the original event, retrieve it
	                    if( event.originalEvent !== undefined ){
	                    	event = event.originalEvent;
	                    }
	                    var delta = event.deltaY;
						console.log(delta);
	                    scroll( - delta * 40 );
	                    return false;
	                });
	            }
	            var scrlbMousedown, scrlbOffset;
	            scrlb.on('mousedown', function(event) {
	                event.preventDefault();
	                scrlbMousedown = true;
	
	                // Set mouseup listener
	                angular.element(document).on('mouseup', function() {
	                    scrlbMousedown = false;
	                });	
	                scrlbOffset = event.screenY;
	                return false;
	            });
	            angular.element(document).on('mousemove', function(event) {
	                if(!scrlbMousedown) return;
	                event.preventDefault();
	
	                var delta = event.screenY - scrlbOffset;
	                delta *= config.dragSpeedModifier;
	                scrlbOffset += delta * (scrlbLength / cntSize);
	
	                scroll( -delta );
	            });
	            element.on('mouseenter', function() {
                    scrlb.css('opacity', 1);
                });
                scrlbCnt.on('mouseenter', function() {
                    scrlb.css('opacity', 1);
                });
                element.on('mouseleave', function() {
                    if(scrlbMousedown) return;
                    scrlb.css('opacity', 0);
                });
                
                // On enter scrollbar container
	            scrlbCnt.on('mouseenter', function() {
	                //scrlbCnt.css('background', 'rgba(0,0,0,.1)');
	                scrlb.css( 'width', '6px' );
	                scrlb.css( 'right', '3px' );
	                scrlb.css( 'border-radius', '3px' );
	            });
	            scrlbCnt.on('mouseleave', function() {
	                //scrlbCnt.css('background', 'none');
	                scrlb.css( 'width',  '6px' );
	                scrlb.css( 'right', '3px' );
	                scrlb.css( 'border-radius', '3px' );
	            });
	
	            // Initial calculate
	            recalculate();
	        }
        }
	};
	return scrollbar;
});