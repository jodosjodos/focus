import ExpoModulesCore
import SwiftUI
import FamilyControls

/// Hosts Apple's SwiftUI-only `FamilyActivityPicker` inside the RN view tree.
/// `FamilyActivitySelection` is deliberately opaque — no bundle IDs or names
/// ever leave this view — so the only thing that crosses the bridge is an
/// encoded `token` string, consumed by `ExpoScreenShieldModule.applyShield`.
public class ExpoScreenShieldPickerView: ExpoView {
  let onSelectionChange = EventDispatcher()
  let onDismiss = EventDispatcher()

  private let model = PickerModel()
  private var hostingController: UIHostingController<PickerRoot>?

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    model.onChange = { [weak self] selection in
      self?.emitSelection(selection)
    }
    // Apple's sheet flips this to false on both Cancel and Done — that's the
    // only signal it gives us, so the RN side treats either as "leave this
    // screen now" rather than leaving the user staring at a dismissed sheet.
    model.onDismissed = { [weak self] in
      self?.onDismiss([:])
    }

    let hosting = UIHostingController(rootView: PickerRoot(model: model))
    hosting.view.backgroundColor = .clear
    hostingController = hosting
    addSubview(hosting.view)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()
    // Proper UIKit containment so the hosted SwiftUI picker gets correct
    // appearance-transition callbacks — ExpoView doesn't hand us the owning
    // UIViewController directly, so we walk the responder chain for it.
    guard let hosting = hostingController else { return }
    if window != nil, let parentVC = nearestViewController() {
      if hosting.parent !== parentVC {
        hosting.willMove(toParent: nil)
        hosting.view.removeFromSuperview()
        hosting.removeFromParent()
        parentVC.addChild(hosting)
        addSubview(hosting.view)
        hosting.didMove(toParent: parentVC)
      }
    } else {
      hosting.willMove(toParent: nil)
      hosting.view.removeFromSuperview()
      hosting.removeFromParent()
    }
  }

  private func nearestViewController() -> UIViewController? {
    var responder: UIResponder? = self
    while let current = responder {
      if let vc = current as? UIViewController { return vc }
      responder = current.next
    }
    return nil
  }

  private func emitSelection(_ selection: FamilyActivitySelection) {
    guard let data = try? JSONEncoder().encode(selection) else { return }
    let token = data.base64EncodedString()
    onSelectionChange([
      "token": token,
      "applicationCount": selection.applicationTokens.count,
      "categoryCount": selection.categoryTokens.count,
    ])
  }
}

private class PickerModel: ObservableObject {
  @Published var selection = FamilyActivitySelection()
  @Published var isPresented = true
  var onChange: ((FamilyActivitySelection) -> Void)?
  var onDismissed: (() -> Void)?
}

private struct PickerRoot: View {
  @ObservedObject var model: PickerModel

  var body: some View {
    Color.clear
      .familyActivityPicker(isPresented: $model.isPresented, selection: $model.selection)
      .onChange(of: model.selection) { newValue in
        model.onChange?(newValue)
      }
      .onChange(of: model.isPresented) { presented in
        if !presented {
          model.onDismissed?()
        }
      }
  }
}

/// Own module purely so this View resolves unambiguously on the JS side via
/// `requireNativeViewManager('ExpoScreenShieldPicker')` — a Module hosting
/// more than one View needs an index/name Expo's JS-side helper doesn't
/// expose cleanly, so each View gets a single-purpose Module instead.
public class ExpoScreenShieldPickerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoScreenShieldPicker")
    View(ExpoScreenShieldPickerView.self) {
      Events("onSelectionChange", "onDismiss")
    }
  }
}
