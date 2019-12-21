import React, {useRef} from "react";
import { ListWrapper, ListItem, List } from "./style";
import { getCount } from "../../../../utils/base";
import Scroll from '../../../../components/scroll'
function RecommendList(props) {
  const listScroll = useRef()
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <Scroll ref={listScroll} listenScroll={true} pullDownRefresh={{threshold: 70, stop: 60}} pullUpLoad={{threshold: 40}}>
        <List>
          {props.recommendList.map((item, index) => (
            <ListItem key={item.id + index}>
              <div className="img_wrapper">
                <div className="decorate"></div>
                {/* 加此参数可以减小请求的图片资源大小 */}
                <img
                  src={item.picUrl + "?param=300x300"}
                  width="100%"
                  height="100%"
                  alt="music"
                />
                <div className="play_count">
                  <i className="iconfont play">&#xe885;</i>
                  <span className="count">{getCount(item.playCount)}</span>
                </div>
              </div>
              <div className="desc">{item.name}</div>
            </ListItem>
          ))}
        </List>
      </Scroll>
    </ListWrapper>
  );
}
export default React.memo(RecommendList);