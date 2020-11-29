<div style='position:absolute;left:0;top:0px;width:2000px'>
	<div style='position:relative;height:500px'>
	<canvas style="position:absolute;left:0px" id="bg_ctx" width="1760" height="450"></canvas> 
	<canvas  class="visualizer" style="position:absolute;left:0px" width="2000" height="450"></canvas> 
</div>
<div>

	
  <div>
	<label for="voice">Voice setting</label>
	<select id="voice" name="voice">
	  <option value="distortion">Distortion</option>
	  <option value="convolver">Reverb</option>
	  <option value="biquad">Bass Boost</option>
	  <option value="off" selected>Off</option>
	</select>
  </div>
  <div>
	<label for="visual">Visualizer setting</label>
	<select id="visual" name="visual">
	  <option value="sinewave">Sinewave</option>
	  <option value="frequencybars" selected>Frequency bars</option>
	  <option value="off">Off</option>
	</select>
  </div>
  <div>
	<a class="mute">Mute</a>
  </div>

<script nocache="true" src="musicscope.js"></script>