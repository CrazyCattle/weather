export default function svg (){
  var pointGrounp = document.getElementsByClassName("point-group");
  var delay  = 0.06;  //�ӳٶ���/��
  var speed  = 800; //�����ٶ�/����

  function run(){
    for(var i = pointGrounp.length - 1; i >= 0; i--) {
        var childs = pointGrounp[i].children;
        for(var j = childs.length - 1; j >= 0; j--) {
            childs[j].setAttribute("fill","#ffffff");
            childs[j].setAttribute("style","animation: lightup  "+speed+"ms cubic-bezier(0.86, 0, 0.17, 1) infinite;animation-delay:"+delay/100*j+"s;");
        }
        speed = random(1200,1500);
        delay = random(8,10);
    }
  }
  function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
  }

  run();
}
