import { Injectable, Inject, ComponentFactoryResolver, TemplateRef } from "@angular/core";
import { DemisPopup, ComponentType, DemisPopupRefs, DemisPopupConfig } from "./demis-popup";

@Injectable()
export class DemisPopupService {
    factoryResolver: any;
    rootViewContainer: any;
    constructor(@Inject(ComponentFactoryResolver) factoryResolver, ) {
        this.factoryResolver = factoryResolver
    }
    open<T, D = any>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        config?: DemisPopupConfig<D>): Promise<any> {
        return new Promise((resolve, reject) => {
            config = _applyConfigDefaults(config, new DemisPopupConfig());
            config.result = resolve;            
            this.addDynamicComponent(config, componentOrTemplateRef)
        })
    }
    setRootViewContainerRef(viewContainerRef) {
       
        let hasDefined = false;
        if (this.rootViewContainer)
            this.rootViewContainer._embeddedViews.forEach(el => {
                el.nodes.forEach(node => {
                    if (node.instance && node.instance.config) {
                        hasDefined = true;
                        return true;
                    }
                });
            })
        if (hasDefined)
            this.rootViewContainer = null;
        if (!this.rootViewContainer || this.rootViewContainer._embeddedViews.length <= 0)
            this.rootViewContainer = viewContainerRef;
    }
    addDynamicComponent(config, componentOrTemplateRef) {
        try {
            const containerFactory = this.factoryResolver.resolveComponentFactory(DemisPopup)
            const templateFactory = this.factoryResolver.resolveComponentFactory(componentOrTemplateRef)
            const componentContainer = containerFactory.create(this.rootViewContainer.parentInjector)
            const tamplateContainer = templateFactory.create(this.rootViewContainer.injector)
            componentContainer.instance.config = config || {};
            componentContainer.instance.config.visible = true;
            componentContainer.instance.config.close = (e) => {
                setTimeout(() => {
                    componentContainer.instance.close();                    
                }, 200);
            };
            componentContainer.instance.config.onOpening = (e) => {
                if (config.show)
                    config.show(e);
            };
                     
              
            componentContainer.instance.vcr.insert(tamplateContainer.hostView)            
            this.rootViewContainer.insert(componentContainer.hostView)
            componentContainer.changeDetectorRef.detectChanges();
        } catch (err) {
            console.log(err);
        }
    }
}
function _applyConfigDefaults(
    config?: DemisPopupConfig, defaultOptions?: DemisPopupConfig): DemisPopupConfig {
    return { ...defaultOptions, ...config };
}