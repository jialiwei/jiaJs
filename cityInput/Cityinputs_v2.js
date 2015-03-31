window.Cityinputs=window.Cityinputs || {};
window.Cityinputs=function(container,options){
	this.init(container,options);
}
window.Cityinputs.prototype={
		provinceInputTemp:'<div class="province_item"><input type="checkbox" value="$value" class="province_check_box"/><span class="province_name">$label</span></div>',
		cityInputTemp:'<div class="city_item" data-parent="$parent"><input type="checkbox" value="$value" class="city_check_box"/><span class="city_name">$label</span></div>',
		distrinctInputTemp:'<div class="distrinct_item" data-parent="$parent"><input type="checkbox" value="$value" class="distrinct_check_box"/><span class="distrinct_name">$label</span></div>',
		init:function(container,options){
			var areas=$('<fieldset id="city_input_province_fieldset"><legend><input type="checkbox" id="city_input_province_selectall"/>省</legend><div id="city_input_province_area"></fieldset>'+
								'<fieldset id="city_input_city_fieldset"><legend><input type="checkbox" id="city_input_city_selectall"/>市</legend></div><div id="city_input_city_area"></fieldset>'+
								'<fieldset id="city_input_distrinct_fieldset"><legend><input type="checkbox" id="city_input_distrinct_selectall"/>区</legend></div><div id="city_input_district_area"></div></fieldset>');
			container.append(areas);
			this.provinceArea=container.find("#city_input_province_area");
			this.cityArea=container.find("#city_input_city_area");
			this.districtArea=container.find("#city_input_district_area");
			$.extend(this,{ //default options
				provinceUrl:"",// input selection
				cityUrl:"",     // [val,val,val] or [{val,id},{val,id},{val,id},{val,id}]
				distrinctUrl:"",  //
				defaultSelect:false
			},options);
			
			this._addClick();
			var that=this;
			$.get(that.provinceUrl,function(data){
				that._fillProvince(data);
			});
		},
		_addClick:function(){
			var that=this;
			that.provinceArea.on("click",".province_check_box",function(){
				var $this= $(this);
				var checked=$this.prop("checked");
				var selectedProvince = $this.val();
				if(checked){
					$.get(that.cityUrl,{province:selectedProvince},function(data){
						that._fillCity(data,selectedProvince);
					})
				}else{
					that.cityArea.find("div[data-parent='"+selectedProvince+"']").each(function(){
						var $this=$(this);
						var checkBox=$this.find("input.city_check_box");
						var checked= checkBox.prop("checked");
						if(checked){
							var cityValue=checkBox.val();
							that.districtArea.find("div[data-parent='"+cityValue+"']").remove();
						}
							this.remove();
					});
				}
			});
			that.cityArea.on("click",".city_check_box",function(){
				var $this=$(this);
				var checked=$this.prop("checked");
				var selectedCity=$this.val();
				if(checked){
					$.get(that.distrinctUrl,{city:selectedCity},function(data){
						that._fillDistrinct(data,selectedCity);
					});
				}else{
					that.districtArea.find("div[data-parent='"+selectedCity+"']").remove();
				}
			});
			$("#city_input_province_selectall").on("click",function(){
				var $this=$(this);
				var checked=$this.prop("checked");
				that.provinceArea.find(".province_check_box").each(function(){
					if($(this).prop("checked")!=checked){
						$(this).trigger("click");
					}
				});
			});
			$("#city_input_city_selectall").on("click",function(){
				var checked=$(this).prop("checked");
				that.cityArea.find(".city_check_box").each(function(){
					if($(this).prop("checked")!=checked){
						$(this).trigger("click");
					}
				});
			});
			$("#city_input_distrinct_selectall").on("click",function(){
				var checked=$(this).prop("checked");
				that.districtArea.find(".distrinct_check_box").each(function(){
					if($(this).prop("checked")!=checked){
						$(this).trigger("click");
					}
				});
			});
		},
		_fillProvince:function(data){
			var that=this;
			for(var i=0;i<data.length;i++){
				var provinceItem=that.provinceInputTemp.replace("\$value",data[i].value).replace("\$label",data[i].label);
				that.provinceArea.append($(provinceItem));
			}
		},
		_fillCity:function(data,province){
			var that=this;
			for(var i=0;i<data.length;i++){
				var cityItem=$(that.cityInputTemp.replace("\$value",data[i].value).replace("\$label",data[i].label).replace("\$parent",province));
				that.cityArea.append(cityItem);
			}
		},
		_fillDistrinct:function(data,city){
			var that=this;
			for(var i=0;i<data.length;i++){
				var distrinctItem=that.distrinctInputTemp.replace("\$value",data[i].value).replace("\$label",data[i].label).replace("\$parent",city);
				that.districtArea.append(distrinctItem);
			}
		},
		getSelectedCity:function(){
			var cities=new Array();
			this.cityArea.find(".city_check_box").each(function(){
				var $this=$(this)
				if($this.prop("checked")){
					cities.push($(this).val());
				}
			});
			this.districtArea.find(".distrinct_check_box").each(function(){
				var $this=$(this)
				if($this.prop("checked")){
					cities.push($(this).val());
				}
			})
			return cities;
		}
}