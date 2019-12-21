import BetterScroll from "better-scroll";
import PullDown from "@better-scroll/pull-down";
import Pullup from "@better-scroll/pull-up";
import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle
} from "react";
import { ScrollWrapper } from "./style";
import PropTypes from "prop-types";
import PullDownCom from "./pullDown";
import PullUpDom from "./pullUp";
BetterScroll.use(PullDown);
BetterScroll.use(Pullup);

const Scroll = forwardRef((props, ref) => {
  const DIRECTION_H = "horizontal";
  const DIRECTION_V = "vertical";
  const ScrollContainer = useRef();
  const { click, probeType, startX, freeScroll, startY, direction } = props;
  const [bScroll, setBScroll] = useState();
  useEffect(() => {
    if (!ScrollContainer) {
      return;
    }
    let options = {
      probeType,
      click,
      scrollY: freeScroll || direction === DIRECTION_V,
      scrollX: freeScroll || direction === DIRECTION_H,
      pullDownRefresh,
      pullUpLoad,
      startY,
      startX,
      freeScroll
    };
    let scroll = new BetterScroll(ScrollContainer.current, options);
    setBScroll(scroll);
    return () => {
      setBScroll(null);
    };
  }, []);
  const {
    listenScroll,
    listenScrollEnd,
    listenBeforeScroll,
    pullDownRefresh,
    pullUpLoad
  } = props;
  const [BeforePullDown, setBeforePullDown] = useState(true);
  const [IsPullingDown, setIsPullingDown] = useState(false);
  const [IsPullUpLoad, setIsPullUpLoad] = useState(false);
  useEffect(() => {
    if (!bScroll) return;
    if (bScroll) {
      bScroll.refresh();
    }
    if (listenScroll) {
      // probeType为0无效
      bScroll.on("scroll", pos => {
        // 监听滚动
      });
    }
    if (listenScrollEnd) {
      bScroll.on("scrollEnd", pos => {});
    }
    if (listenBeforeScroll) {
      bScroll.on("beforeScrollStart", () => {});
      bScroll.on("scrollStart", () => {});
    }
    if (pullDownRefresh) {
      bScroll.on("pullingDown", async () => {
        // 必须要写，不然不能出发下一次
        setBeforePullDown(false);
        setIsPullingDown(true);

        await new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 500);
        });

        setIsPullingDown(false);

        await new Promise(resolve => {
          setTimeout(() => {
            bScroll.finishPullDown();
            resolve();
          }, 600);
        });
        setTimeout(() => {
          setBeforePullDown(true);
          bScroll.refresh();
        }, 800);
      });
    }
    if (pullUpLoad) {
      bScroll.on("pullingUp", async () => {
        console.log("上啦");
        setIsPullUpLoad(true);

        await new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
        bScroll.finishPullUp();
        bScroll.refresh();
        setIsPullUpLoad(false);
      });
    }
    return () => {
      bScroll.off("scroll");
    };
  }, [bScroll]);
  // 判断bScroll是否存在，存在刷新
  // 下啦判断
  // 向父组件暴漏方法
  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    // 给外界暴露 getBScroll 方法，提供 bs 实例
    getBScroll() {
      console.log("hbbb", bScroll);
      if (bScroll) {
        return bScroll;
      }
    }
  }));
  return (
    <div>
      <PullDownCom
        beforePullDown={BeforePullDown}
        isPullingDown={IsPullingDown}
      />
      <ScrollWrapper ref={ScrollContainer}>
        <div>
          {props.children}
          <PullUpDom isPullUpLoad={IsPullUpLoad} />
        </div>
      </ScrollWrapper>
    </div>
  );
});
Scroll.defaultProps = {
  click: false,
  probeType: 2,
  startX: 0,
  startY: 0,
  listenScroll: false,
  listenBeforeScroll: false,
  listenScrollEnd: false,
  enabled: false,
  direction: "vertical", // 'horizontal'
  pullDownRefresh: false,
  pullUpLoad: false,
  refreshDelay: 200,
  refresh: null,
  destroy: null,
  freeScroll: false
};
Scroll.PropTypes = {
  click: PropTypes.bool,
  probeType: PropTypes.number,
  listenScroll: PropTypes.bool,
  freeScroll: PropTypes.bool,
  startX: PropTypes.number,
  startY: PropTypes.number,
  listenBeforeScroll: PropTypes.bool,
  listenScrollEnd: PropTypes.bool,
  enabled: PropTypes.bool,
  direction: PropTypes.string,
  pullDownRefresh: PropTypes.bool | PropTypes.object,
  pullUpLoad: PropTypes.object | PropTypes.bool,
  refreshDelay: PropTypes.number,
  refresh: PropTypes.func,
  destroy: PropTypes.func
};
export default Scroll;